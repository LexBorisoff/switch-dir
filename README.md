# `switch-dir`

![Build](https://img.shields.io/github/actions/workflow/status/LexBorisoff/switch-dir/release.yml)
![NPM Version](https://img.shields.io/npm/v/switch-dir)

CLI for fast and interactive navigation between directories.

- [Installation](#installation)
- [Usage](#usage)
  - [Arguments](#arguments)
  - [Ambiguous arguments](#ambiguous-arguments)
  - [Interactive mode](#interactive-mode)
  - [Starting path](#starting-path)
- [Portals](#portals)
  - [List portals](#list-portals)
  - [Add a new portal](#add-a-new-portal)
  - [Delete portals](#delete-portals)

## Installation

**Step 1**. Run the following command using **_npx_** from any directory.

```bash
npx switch-dir
```

**Step 2**. Follow the prompts to set up the command name.

**Step 3**. Once the installation process is complete, add the following lines to your shell configuration file.

- For POSIX-compatible shells like bash or zsh

```bash
# ~/.bashrc or ~/.zshrc

if test -f ~/.switch-dir/start.sh; then
  . ~/.switch-dir/start.sh
fi
```

- For PowerShell

```powershell
# C:\Program Files\PowerShell\7\profile.ps1

if (Test-Path -Path "$env:HOMEPATH\.switch-dir\bin") {
  $env:Path = "$env:HOMEPATH\.switch-dir\bin;$env:Path"
}
```

> 💡 To get the path of your PowerShell configuration file, type `$PROFILE.` and tab through the available options to choose the necessary profile.

**Step 4**. Restart your shell. The command should now be available.

### How it works

The installation process creates a `~/.switch-dir` directory where it installs the **_core library_** and creates a **_shell script_** that acts as the program's main entry point. For shells like bash and zsh, the script contains a function that allows changing directories within the shell. To have this function available as a command, the script must be sourced on each shell startup, which is handled in the `start.sh` script. For PowerShell, the script's directory (`bin`) is added to your PATH, making the script accessible from anywhere in the shell. By giving the script (or function) a name that you prefer (or sticking to the default), you control how to invoke the program.

### Renaming the command

You can rename the command later by providing the `--rename` option with the new command name. If the name is not provided, you will be prompted to enter one. For POSIX shells, you will need to restart the shell after you've renamed the command.

```bash
sd --rename <new-name>
```

> 📚 All following examples will assume the command name is `sd`

## Usage

To interactively select a directory to switch to, run the command you created during the installation. Calling without any arguments or options will display all available directories in the current directory.

For example:

```bash
sd
```

```text
app
├── components
│   ├── button
│   ├── card
│   ├── modal
│   └── navbar
│       ├── link
│       └── menu
├── config
│   ├── dev
│   ├── prod
│   └── test
└── controllers
    ├── auth
    │   ├── login
    │   └── register
    └── user
```

<img src="https://github.com/LexBorisoff/switch-dir/blob/main/media/usage.gif?raw=true" alt="usage example" width="1000" />

### Arguments

Supplying command arguments will build the final path by matching each argument with a directory.

For example, to navigate to `~/dev/app/components/navbar/link/` you could run the command from the home `~` directory as follows:

```bash
sd dev app comp nav link
```

<img src="https://github.com/LexBorisoff/switch-dir/blob/main/media/arguments.gif?raw=true" alt="usage example" width="1000" />

### Ambiguous arguments

When multiple directories match a given argument, the CLI will prompt you to manually resolve this ambiguity by selecting the desired directory.

<img src="https://github.com/LexBorisoff/switch-dir/blob/main/media/multiple-matches.gif?raw=true" alt="usage example" width="1000" />

> 💡 When multiple directories match an argument but there is an exact match, it will be chosen automatically.

### Interactive mode

By default, providing command arguments or using the [`--root` option](#starting-path) or the [`--portal` option](#portals) will navigate to the constructed path without displaying the selection prompt. You can change this behavior by providing the `--interactive` or `-i` flag which allows you to continue the directory search by using the selection prompt.

For example:

```bash
sd dev app conf prod -i
```

> 👆 constructs the path based on the provided arguments and prompts you to select directories from there

### Starting path

To start navigation from a specific path rather than the current directory, you can provide the `--root` or `-r` option followed by the desired path. If there are no [command arguments](#arguments), it will simply switch to that path.

For example:

```bash
sd --root ~/dev
```

> 👆 navigates to the `~/dev` directory

```bash
sd app conf prod --root ~/dev
```

> 👆 navigates to `~/dev/app/config/prod` from whatever directory you are in

## Portals

Portals are a way to quickly switch to saved directories using portal names instead of full paths. They function similarly to the `--root` option but accept a name value rather than a directory path. If no name is provided, you will be prompted to select one.

To navigate to a saved portal, use the `--portal` or `-p` option. For example:

```bash
sd --portal
```

> 👆 displays the selection prompt with all available portals

To navigate to a portal named `app` which points to the `~/dev/app` path, you can run the following command:

```bash
sd --portal app
```

You can also specify a partial name of the portal and it will still be matched. If there are multiple or no matches, you will be prompted to select the desired portal - just like with the directory selection (similarly, if there is an exact match, it will be chosen automatically).

```bash
sd -p a
```

### Add a new portal

To save a directory path as a portal, use the `--add` or `-a` option with the value of the portal's path. You will then be prompted to create the portal name.

For example:

```bash
sd --add .
```

> 👆 saves the current directory path and displays a prompt to create the portal name

### List portals

To list the saved portals, use the `--list` or `-l` flag.

```bash
sd --list
```

### Delete portals

To delete one or more portals, use the `--delete` or `-d` flag.

```bash
sd --delete
```

#### Prune portals

If there are portal paths that are unreachable (for example, a directory was deleted or renamed), the delete option will ask if you want to prune them, i.e. to delete all unreachable portals.
