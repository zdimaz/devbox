# ZSH

## 🧠 Суть

Zsh + Oh My Zsh — улучшенный shell с автодополнением, подсветкой, темами.

## ⚙️ Установка

```bash
sudo pacman -S zsh
chsh -s /usr/bin/zsh
```

- `pacman -S zsh` — установка Zsh
- `chsh -s /usr/bin/zsh` — смена shell по умолчанию на Zsh

После `chsh` — релогин.

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Установка Oh My Zsh — фреймворка для управления конфигами и плагинами Zsh.

## 💻 Плагины

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

git clone https://github.com/zsh-users/zsh-completions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions

git clone https://github.com/zsh-users/zsh-autocomplete \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autocomplete
```

- `zsh-autosuggestions` — подсказки при вводе на основе истории
- `zsh-syntax-highlighting` — подсветка синтаксиса команд (ошибки красным)
- `zsh-completions` — дополнительные автодополнения
- `zsh-autocomplete` — выпадающий список автодополнения

```bash
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  zsh-completions
  zsh-autocomplete
)
```

Подключение плагинов в `~/.zshrc`. `zsh-syntax-highlighting` должен быть **последним**.

## 💻 Тема Powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
```

`--depth=1` — скачать только последний коммит (быстрее).

В `~/.zshrc` добавь:

```bash
# Powerlevel10k подключается автоматически при наличии в ZSH_CUSTOM
```

После — `p10k configure` для настройки внешнего вида.

## 💻 fzf (поиск)

```bash
sudo pacman -S fzf
```

FZF — fuzzy finder для поиска по истории, файлам, процессам.

В `~/.zshrc`:

```bash
[ -f /usr/share/fzf/key-bindings.zsh ] && source /usr/share/fzf/key-bindings.zsh
[ -f /usr/share/fzf/completion.zsh ] && source /usr/share/fzf/completion.zsh
```

- `key-bindings.zsh` — `Ctrl+R` для поиска по истории
- `completion.zsh` — `**` + Tab для автодополнения путей

## 💻 CLI инструменты

```bash
sudo pacman -S bat exa ripgrep fd dust btop fzf tree unzip zip lazygit
```

| Инструмент    | Замена | Что делает                         |
| ------------- | ------ | ---------------------------------- |
| `bat`         | `cat`  | Подсветка синтаксиса, номера строк |
| `exa`         | `ls`   | Цвета, иконки, дерево              |
| `ripgrep`     | `grep` | Быстрый поиск по содержимому       |
| `fd`          | `find` | Быстрый поиск файлов               |
| `dust`        | `du`   | Визуализация размера папок         |
| `btop`        | `htop` | Мониторинг процессов               |
| `lazygit`     | `git`  | TUI-интерфейс для Git              |
| `tree`        | —      | Дерево файлов                      |
| `unzip`/`zip` | —      | Архивация                          |

## 💻 Алиасы в Zsh

```bash
nano ~/.oh-my-zsh/custom/aliases.zsh
```

OMZ автоматически подгружает все `*.zsh` из `custom/` — не нужно править `.zshrc`.

## 💻 Автообновление плагинов

```bash
omz update
```

Обновление Oh My Zsh и всех плагинов.

```bash
crontab -e
0 5 * * 1  omz update > /dev/null 2>&1
```

Автоматическое обновление каждый понедельник в 5:00 через cron.

## ⚠️ Подводные камни

- Порядок плагинов важен: `zsh-syntax-highlighting` **последним**
- После `chsh` — обязательно релогин
- `source ~/.zshrc` или `exec zsh` для применения
