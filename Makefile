.PHONY: build

build:
	@echo "Building..."
	mkdir -p .cache && printf "const DEFAULT_CONFIG = %s;\nconst META= %s;\nconst DYNAMIC_I18N = %s;\n" "$$(cat ./dist/default_config.json)" "$$(cat ./dist/meta.json)" "$$(cat ./dist/dynamic-i18n.json)" > .cache/worker.js && cat worker.template.js >> .cache/worker.js

.PHONY: androidapp
androidapp:
	deno run -A ./scripts/publish_android.ts android_app_info=${android_app_info} is_cn_site=${is_cn_site}

.PHONY: dev
dev:
	npx wrangler dev
