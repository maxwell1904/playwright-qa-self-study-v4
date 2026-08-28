import http from 'node:http';
import { URL } from 'node:url';

const host = '127.0.0.1';
const port = 4173;
const initialPhone = '0901234567';
const csrfToken = 'sandbox-token';
const apiToken = 'lab-api-token';

const state = {
  customerPhones: new Map(),
  managerResetCount: 0,
  tasks: new Map(),
  nextTaskId: 1,
};

const services = [
  ['GIAT_SAY_KG', 'Giặt sấy quần áo', 'KG', '25.000 ₫'],
  ['GIAT_HAP_AO', 'Giặt hấp áo vest', 'ITEM', '80.000 ₫'],
  ['UI_QUAN_AO', 'Ủi quần áo', 'ITEM', '12.000 ₫'],
];

const orders = [
  ['LD-001', 'Nguyễn An', 'Đã tiếp nhận'],
  ['LD-002', 'Trần Bình', 'Đang xử lý'],
  ['LD-003', 'Lê Chi', 'Sẵn sàng trả'],
];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function layout(title, body, extraHead = '') {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Lab</title>
  <style>
    :root { color-scheme: light; font-family: Arial, sans-serif; --ink:#17324d; --green:#146b4a; }
    body { margin: 0; color: #17212b; background: #f4f6f8; }
    header, main { max-width: 920px; margin: auto; }
    header { padding: 18px 24px 10px; }
    nav a { margin-right: 14px; color: var(--ink); }
    main { background: white; min-height: 68vh; padding: 28px; border: 1px solid #d8dee5; }
    h1 { color: var(--ink); }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccd4dc; padding: 10px; text-align: left; }
    th { background: #eaf0f5; }
    label { display: block; font-weight: 700; margin: 12px 0 5px; }
    input, select, button { font: inherit; padding: 9px; }
    button, .button { background: var(--green); color: white; border: 0; text-decoration: none; display: inline-block; cursor: pointer; }
    .overlay { position: fixed; inset: 0; background: rgba(20,30,40,.22); display:grid; place-items:center; z-index:5; }
    .overlay span { background:white; padding:16px; border:1px solid #777; }
    [role=status] { margin: 12px 0; padding: 10px; border-left: 4px solid var(--green); background: #edf8f3; }
    .error { padding: 12px; border-left: 4px solid #a32626; background:#fff0f0; }
  </style>
  ${extraHead}
</head>
<body>
  <header>
    <nav aria-label="Lab navigation">
      <a href="/">Trang lab</a>
      <a href="/services">Dịch vụ</a>
      <a href="/orders">Đơn hàng</a>
      <a href="/slow-form">Form chậm</a>
      <a href="/controls">Controls</a>
      <a href="/login">Đăng nhập</a>
    </nav>
  </header>
  <main>${body}</main>
</body>
</html>`;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-lab-correlation-id': `lab-${String(state.nextTaskId).padStart(4, '0')}`,
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function sendApiError(res, status, code, message) {
  sendJson(res, status, { error: { code, message } });
}

function redirect(res, location, headers = {}, status = 303) {
  res.writeHead(status, { location, 'cache-control': 'no-store', ...headers });
  res.end();
}

async function readForm(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return new URLSearchParams(body);
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 100_000) {
      throw new Error('BODY_TOO_LARGE');
    }
  }

  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw new Error('INVALID_JSON');
  }
}

function hasApiToken(req) {
  return req.headers.authorization === `Bearer ${apiToken}`;
}

function normalizedOwner(pathname, prefix) {
  const raw = decodeURIComponent(pathname.slice(prefix.length));
  return /^[a-zA-Z0-9_-]{1,80}$/.test(raw) ? raw : null;
}

function sessionRole(req) {
  const cookie = req.headers.cookie ?? '';
  const match = cookie.match(/(?:^|;\s*)lab_session=(staff|manager)(?:;|$)/);
  return match?.[1] ?? null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}:${port}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    send(res, 200, 'ok', { 'content-type': 'text/plain; charset=utf-8' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/services') {
    sendJson(res, 200, services.map(([code, name, unit, formattedPrice]) => ({
      code,
      name,
      unit,
      price: Number(formattedPrice.replaceAll(/\D/g, '')),
      active: true,
    })));
    return;
  }

  if (url.pathname.startsWith('/api/customers/')) {
    const owner = normalizedOwner(url.pathname, '/api/customers/');
    if (!owner) {
      sendApiError(res, 400, 'INVALID_OWNER', 'Owner must use 1-80 letters, numbers, _ or -.');
      return;
    }
    if (!hasApiToken(req)) {
      sendApiError(res, 401, 'UNAUTHORIZED', 'Use the sandbox Bearer token.');
      return;
    }

    if (req.method === 'GET') {
      if (!state.customerPhones.has(owner)) {
        sendApiError(res, 404, 'CUSTOMER_NOT_FOUND', 'No owned customer state exists.');
        return;
      }
      sendJson(res, 200, { owner, phone: state.customerPhones.get(owner) });
      return;
    }

    if (req.method === 'PUT') {
      let body;
      try {
        body = await readJson(req);
      } catch (error) {
        const code = error instanceof Error ? error.message : 'INVALID_JSON';
        sendApiError(res, code === 'BODY_TOO_LARGE' ? 413 : 400, code, 'Body must be small valid JSON.');
        return;
      }

      const phone = body && typeof body === 'object' ? body.phone : undefined;
      if (typeof phone !== 'string' || !/^0\d{9}$/.test(phone)) {
        sendApiError(res, 400, 'INVALID_PHONE', 'Phone must contain exactly 10 digits and begin with 0.');
        return;
      }

      const created = !state.customerPhones.has(owner);
      state.customerPhones.set(owner, phone);
      sendJson(res, created ? 201 : 200, { owner, phone }, {
        location: `/api/customers/${encodeURIComponent(owner)}`,
      });
      return;
    }

    if (req.method === 'DELETE') {
      if (!state.customerPhones.delete(owner)) {
        sendApiError(res, 404, 'CUSTOMER_NOT_FOUND', 'No owned customer state exists.');
        return;
      }
      res.writeHead(204, { 'cache-control': 'no-store' });
      res.end();
      return;
    }

    sendApiError(res, 405, 'METHOD_NOT_ALLOWED', 'Use GET, PUT or DELETE.');
    return;
  }

  if (url.pathname === '/tasks') {
    if (req.method === 'GET') {
      sendJson(res, 200, [...state.tasks.values()]);
      return;
    }

    if (req.method === 'POST') {
      let body;
      try {
        body = await readJson(req);
      } catch (error) {
        const code = error instanceof Error ? error.message : 'INVALID_JSON';
        sendApiError(res, code === 'BODY_TOO_LARGE' ? 413 : 400, code, 'Body must be small valid JSON.');
        return;
      }

      const title = body && typeof body === 'object' ? body.title : undefined;
      const priority = body && typeof body === 'object' ? body.priority : undefined;
      if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 80) {
        sendApiError(res, 400, 'INVALID_TITLE', 'Title length must be 3-80 characters.');
        return;
      }
      if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
        sendApiError(res, 400, 'INVALID_PRIORITY', 'Priority must be LOW, MEDIUM or HIGH.');
        return;
      }
      if ([...state.tasks.values()].some(task => task.title === title.trim())) {
        sendApiError(res, 409, 'DUPLICATE_TITLE', 'Task title already exists in this disposable sandbox.');
        return;
      }

      const id = `T-${String(state.nextTaskId++).padStart(4, '0')}`;
      const task = { id, title: title.trim(), priority, status: 'OPEN' };
      state.tasks.set(id, task);
      sendJson(res, 201, task, { location: `/tasks/${id}` });
      return;
    }

    sendApiError(res, 405, 'METHOD_NOT_ALLOWED', 'Use GET or POST.');
    return;
  }

  if (url.pathname.startsWith('/tasks/')) {
    const id = decodeURIComponent(url.pathname.slice('/tasks/'.length));
    const task = state.tasks.get(id);
    if (!task) {
      sendApiError(res, 404, 'TASK_NOT_FOUND', 'No task has this ID.');
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, task);
      return;
    }

    if (req.method === 'PATCH') {
      let body;
      try {
        body = await readJson(req);
      } catch (error) {
        const code = error instanceof Error ? error.message : 'INVALID_JSON';
        sendApiError(res, code === 'BODY_TOO_LARGE' ? 413 : 400, code, 'Body must be small valid JSON.');
        return;
      }
      const status = body && typeof body === 'object' ? body.status : undefined;
      if (status !== 'DONE' || task.status !== 'OPEN') {
        sendApiError(res, 409, 'INVALID_TRANSITION', 'The only task transition is OPEN to DONE.');
        return;
      }
      const updated = { ...task, status: 'DONE' };
      state.tasks.set(id, updated);
      sendJson(res, 200, updated);
      return;
    }

    if (req.method === 'DELETE') {
      state.tasks.delete(id);
      res.writeHead(204, { 'cache-control': 'no-store' });
      res.end();
      return;
    }

    sendApiError(res, 405, 'METHOD_NOT_ALLOWED', 'Use GET, PATCH or DELETE.');
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    send(res, 200, layout('Trang lab', `
      <h1>Playwright self-study lab</h1>
      <p>Chọn đúng route của mission hiện tại. Đừng mở reference tests trước timebox.</p>
      <ul>
        <li><a href="/services">Semantic service table</a></li>
        <li><a href="/orders">Order row scope</a></li>
        <li><a href="/rerender">Re-render</a></li>
        <li><a href="/slow-form">Actionability + PRG</a></li>
        <li><a href="/delayed-control">Disabled → enabled control</a></li>
        <li><a href="/controls">Form controls + file summary</a></li>
        <li><a href="/customer-state">Shared backend state</a></li>
        <li><a href="/api/services">Practice JSON API</a></li>
        <li><a href="/manager">Role-protected page</a></li>
      </ul>`));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/services') {
    const rows = services.map(([code, name, unit, price]) => `
      <tr><td>${code}</td><th scope="row">${name}</th><td>${unit}</td><td>${price}</td></tr>`).join('');
    send(res, 200, layout('Dịch vụ', `
      <h1>Dịch vụ</h1>
      <table>
        <caption>Bảng giá dịch vụ đang hoạt động</caption>
        <thead><tr><th>Mã</th><th>Dịch vụ</th><th>Đơn vị</th><th>Giá</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/orders') {
    const visibleOrders = url.searchParams.get('order') === 'desc' ? [...orders].reverse() : orders;
    const rows = visibleOrders.map(([code, customer, status]) => `
      <tr>
        <th scope="row">${code}</th><td>${customer}</td><td>${status}</td>
        <td><a href="/orders/detail?code=${code}">Chi tiết</a></td>
      </tr>`).join('');
    send(res, 200, layout('Đơn hàng', `
      <h1>Đơn hàng</h1>
      <p><a href="/orders?order=desc">Đảo thứ tự DOM</a></p>
      <table>
        <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/orders/detail') {
    const requestedCode = url.searchParams.get('code') ?? '';
    const order = orders.find(([code]) => code === requestedCode);
    if (!order) {
      send(res, 404, layout('Không tìm thấy đơn', '<h1>Không tìm thấy đơn</h1>'));
      return;
    }
    const [rawCode, rawCustomer, rawStatus] = order;
    const code = escapeHtml(rawCode);
    const customer = escapeHtml(rawCustomer);
    const status = escapeHtml(rawStatus);
    send(res, 200, layout(`Đơn ${code}`, `
      <h1>Đơn ${code}</h1>
      <p>Khách hàng: ${customer}</p>
      <p>Trạng thái: ${status}</p>
      <p>Chi tiết đơn hàng sandbox.</p>`));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/rerender') {
    const script = `<script>
      setTimeout(() => {
        const oldButton = document.querySelector('#save');
        const next = oldButton.cloneNode(true);
        next.dataset.generation = '2';
        next.addEventListener('click', () => document.querySelector('[role=status]').textContent = 'Đã lưu bởi node mới');
        oldButton.replaceWith(next);
      }, 350);
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('#save').addEventListener('click', () => document.querySelector('[role=status]').textContent = 'Đã lưu bởi node cũ');
      });
    </script>`;
    send(res, 200, layout('Re-render', `
      <h1>Re-render lab</h1>
      <button id="save" data-generation="1">Lưu</button>
      <p role="status" aria-live="polite">Chưa lưu</p>`, script));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/slow-form') {
    const saved = url.searchParams.get('saved') === '1';
    const phone = escapeHtml(url.searchParams.get('phone') ?? '');
    const script = `<script>
      setTimeout(() => document.querySelector('.overlay')?.remove(), 650);
    </script>`;
    send(res, 200, layout('Form chậm', `
      <h1>Form chậm</h1>
      ${saved ? `<p role="status">Đã lưu ${phone}</p>` : ''}
      <div class="overlay" aria-label="Đang chuẩn bị biểu mẫu"><span>Đang tải...</span></div>
      <form method="post" action="/slow-form">
        <label for="phone">Số điện thoại</label>
        <input id="phone" name="phone" type="tel" required>
        <button type="submit">Lưu</button>
      </form>`, script));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/slow-form') {
    const form = await readForm(req);
    const phone = form.get('phone') ?? '';
    await new Promise(resolve => setTimeout(resolve, 180));
    redirect(res, `/slow-form?saved=1&phone=${encodeURIComponent(phone)}`);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/delayed-control') {
    const requestedDelay = Number(url.searchParams.get('delay') ?? 550);
    const delay = Number.isFinite(requestedDelay)
      ? Math.min(Math.max(requestedDelay, 100), 2_000)
      : 550;
    const script = `<script>
      document.addEventListener('DOMContentLoaded', () => {
        const button = document.querySelector('#continue');
        const status = document.querySelector('[role=status]');
        setTimeout(() => {
          button.disabled = false;
          button.textContent = 'Tiếp tục';
        }, ${delay});
        button.addEventListener('click', () => {
          status.textContent = 'Đã tiếp tục khi control sẵn sàng';
        });
      });
    </script>`;
    send(res, 200, layout('Delayed control', `
      <h1>Delayed control</h1>
      <p>Test không được biết delay cụ thể.</p>
      <button id="continue" type="button" disabled>Đang chuẩn bị...</button>
      <p role="status" aria-live="polite">Chưa tiếp tục</p>`, script));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/controls') {
    const script = `<script>
      document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('#controls-form');
        const status = document.querySelector('[role=status]');
        form.addEventListener('submit', event => {
          event.preventDefault();
          const data = new FormData(form);
          const phone = String(data.get('phone') || '');
          const unit = String(data.get('unit') || '');
          const accepted = data.get('acknowledgement') === 'yes';
          const file = data.get('attachment');

          if (!/^0\\d{9}$/.test(phone)) {
            status.textContent = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
            status.dataset.outcome = 'invalid';
            return;
          }
          if (!unit || !accepted || !(file instanceof File) || !file.name) {
            status.textContent = 'Hãy chọn đơn vị, xác nhận và thêm tệp.';
            status.dataset.outcome = 'invalid';
            return;
          }

          status.textContent = 'Sẵn sàng: ' + phone + ' | ' + unit + ' | đã xác nhận | ' + file.name;
          status.dataset.outcome = 'ready';
        });
      });
    </script>`;
    send(res, 200, layout('Controls', `
      <h1>Form controls</h1>
      <form id="controls-form" novalidate>
        <label for="controlPhone">Số điện thoại</label>
        <input id="controlPhone" name="phone" type="tel">

        <label for="pricingUnit">Đơn vị tính</label>
        <select id="pricingUnit" name="unit">
          <option value="">Chọn đơn vị</option>
          <option value="KG">KG</option>
          <option value="ITEM">ITEM</option>
        </select>

        <label>
          <input name="acknowledgement" type="checkbox" value="yes">
          Tôi xác nhận dữ liệu practice
        </label>

        <label for="attachment">Tệp ghi chú</label>
        <input id="attachment" name="attachment" type="file">

        <button type="submit">Tạo tóm tắt</button>
      </form>
      <p role="status" aria-live="polite" data-outcome="idle">Chưa gửi</p>`, script));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/customer-state') {
    const owner = url.searchParams.get('owner') || 'manual';
    const phone = state.customerPhones.get(owner) ?? initialPhone;
    send(res, 200, layout('Customer state', `
      <h1>Customer state lab</h1>
      <p>Owner: <code>${escapeHtml(owner)}</code></p>
      <p>Điện thoại hiện tại: <strong data-testid="current-phone">${escapeHtml(phone)}</strong></p>
      <form method="post" action="/customer-state?owner=${encodeURIComponent(owner)}">
        <label for="customerPhone">Số điện thoại mới</label>
        <input id="customerPhone" name="phone" required>
        <button type="submit">Cập nhật</button>
      </form>`));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/customer-state') {
    const form = await readForm(req);
    const owner = url.searchParams.get('owner') || 'manual';
    state.customerPhones.set(owner, form.get('phone') || initialPhone);
    redirect(res, `/customer-state?owner=${encodeURIComponent(owner)}`);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/test-support/reset') {
    const owner = url.searchParams.get('owner');
    if (owner) {
      state.customerPhones.delete(owner);
    } else {
      state.customerPhones.clear();
      state.managerResetCount = 0;
      state.tasks.clear();
      state.nextTaskId = 1;
    }
    res.writeHead(204, { 'cache-control': 'no-store' });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/login') {
    const error = url.searchParams.get('error') === '1';
    send(res, 200, layout('Đăng nhập', `
      <h1>Đăng nhập</h1>
      ${error ? '<p class="error">Thông tin đăng nhập không hợp lệ</p>' : ''}
      <form method="post" action="/login">
        <label for="username">Tên đăng nhập</label>
        <input id="username" name="username" required>
        <label for="password">Mật khẩu</label>
        <input id="password" name="password" type="password" required>
        <input type="hidden" name="_csrf" value="${csrfToken}">
        <button type="submit">Đăng nhập</button>
      </form>
      <p>Sandbox accounts: <code>staff</code> hoặc <code>manager</code>; password <code>lab</code>.</p>`));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const form = await readForm(req);
    const username = form.get('username');
    const password = form.get('password');
    const token = form.get('_csrf');
    if (token !== csrfToken) {
      send(res, 403, layout('Từ chối', '<h1>403</h1><p>CSRF token không hợp lệ.</p>'));
      return;
    }
    if (!['staff', 'manager'].includes(username) || password !== 'lab') {
      redirect(res, '/login?error=1', {}, 302);
      return;
    }
    redirect(res, '/dashboard', {
      'set-cookie': `lab_session=${username}; HttpOnly; SameSite=Lax; Path=/`,
    }, 302);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/dashboard') {
    const role = sessionRole(req);
    if (!role) {
      redirect(res, '/login', {}, 302);
      return;
    }
    send(res, 200, layout('Bảng điều khiển', `<h1>Bảng điều khiển</h1><p>Vai trò: ${role.toUpperCase()}</p>`));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/manager') {
    const role = sessionRole(req);
    if (!role) {
      redirect(res, '/login', {}, 302);
      return;
    }
    if (role !== 'manager') {
      send(res, 403, layout('Từ chối', '<h1>403</h1><p>Không có quyền Manager.</p>'));
      return;
    }
    send(res, 200, layout('Quản lý', `
      <h1>Quản lý</h1>
      <p>Số lần reset demo: <strong>${state.managerResetCount}</strong></p>
      <form method="post" action="/manager/reset-demo">
        <input type="hidden" name="_csrf" value="${csrfToken}">
        <button type="submit">Reset demo</button>
      </form>`));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/manager/reset-demo') {
    const role = sessionRole(req);
    if (!role) {
      redirect(res, '/login', {}, 302);
      return;
    }
    if (role !== 'manager') {
      send(res, 403, layout('Từ chối', '<h1>403</h1><p>Không có quyền Manager.</p>'));
      return;
    }
    const form = await readForm(req);
    if (form.get('_csrf') !== csrfToken) {
      send(res, 403, layout('Từ chối', '<h1>403</h1><p>CSRF token không hợp lệ.</p>'));
      return;
    }
    state.managerResetCount += 1;
    redirect(res, '/manager');
    return;
  }

  send(res, 404, layout('Không tìm thấy', '<h1>404</h1><p>Không có route này.</p>'));
});

server.listen(port, host, () => {
  process.stdout.write(`Lab server listening on http://${host}:${port}\n`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
