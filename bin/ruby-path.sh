#!/usr/bin/env bash
# Put Homebrew Ruby 3.1 ahead of macOS /usr/bin/ruby (2.6).
if [[ -x /opt/homebrew/opt/ruby@3.1/bin/ruby ]]; then
  export PATH="/opt/homebrew/opt/ruby@3.1/bin:$PATH"
elif [[ -x /usr/local/opt/ruby@3.1/bin/ruby ]]; then
  export PATH="/usr/local/opt/ruby@3.1/bin:$PATH"
fi
