# J04 disposable Git toy

Run `npm run lab:j04` from `lab-kit/`. The script creates a new repository under the operating
system temporary directory, configures identity only inside that toy repo, commits a clean base
and prints the exact path. It never touches the curriculum repository's Git history.

Use that path for the branch/staging/conflict/clean-checkout exercises. The fake `*.local` file
starts untracked and visible so the accidental-stage drill is reproducible; it contains no real
secret. After unstaging without deleting the working copy, add an intentional ignore rule.
