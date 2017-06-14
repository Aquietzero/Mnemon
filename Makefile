TESTS = $(shell find pupil/test/$(target) -type f -name "*.test.js")
TEST_TIMEOUT = 5000
MOCHA_REPORTER = spec

test:
	@NODE_ENV=test mocha \
		-r should \
		--reporter $(MOCHA_REPORTER) \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

.PHONY: test
