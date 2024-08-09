.PHONY: build

build:
	@echo "Building..."
	mkdir -p .cache && printf "const DEFAULT_CONFIG = `%s`;\n" "$$(cat ./dist/default_config.json)" > .cache/worker.js && cat worker.template.js >> .cache/worker.js
