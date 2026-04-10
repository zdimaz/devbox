# ZSH

## 🧠 Суть
Zsh + Oh My Zsh — улучшенный shell с автодополнением, подсветкой, темами.

## ⚙️ Установка

```bash
sudo pacman -S zsh
chsh -s /usr/bin/zsh  # смена shell (релогин)

# Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 💻 Плагины

```bash
# Установка
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

git clone https://github.com/zsh-users/zsh-completions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions

git clone https://github.com/zsh-users/zsh-autocomplete \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autocomplete
```

**Подключение в `~/.zshrc`:**
```bash
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  zsh-completions
  zsh-autocomplete
)
```

## 💻 Тема Powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
```

В `~/.zshrc`:
```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

## 💻 fzf (поиск)

```bash
sudo pacman -S fzf
```

В `~/.zshrc`:
```bash
[ -f /usr/share/fzf/key-bindings.zsh ] && source /usr/share/fzf/key-bindings.zsh
[ -f /usr/share/fzf/completion.zsh ] && source /usr/share/fzf/completion.zsh
```

## 💻 CLI инструменты

```bash
sudo pacman -S bat exa ripgrep fd dust btop fzf tree unzip zip lazygit
```

| Инструмент | Замена | Что делает |
|---|---|---|
| `bat` | `cat` | Подсветка синтаксиса |
| `exa` | `ls` | Цвета, дерево |
| `ripgrep` | `grep` | Быстрый поиск |
| `fd` | `find` | Быстрый поиск файлов |
| `dust` | `du` | Визуализация размера папок |
| `btop` | `htop` | Мониторинг процессов |
| `lazygit` | `git` | TUI для git |

## 💻 Алиасы в Zsh

**Рекомендуемый путь:** `~/.oh-my-zsh/custom/aliases.zsh`

```bash
nano ~/.oh-my-zsh/custom/aliases.zsh
```

OMZ автоматически подгружает всё из `custom/*.zsh` — ничего в `.zshrc` добавлять не нужно.

## 💻 Автообновление плагинов

```bash
omz update

# Или cron (раз в неделю)
crontab -e
0 5 * * 1  omz update > /dev/null 2>&1
```

## ⚠️ Подводные камни
- Порядок плагинов важен: `zsh-syntax-highlighting` **последним**
- После `chsh` — обязательно релогин
- `source ~/.zshrc` или `exec zsh` для применения

## 🔗 Связанные темы
- [Bash Aliases](/dev/bash-aliases)
