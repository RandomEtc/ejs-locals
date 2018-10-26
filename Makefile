TESTS = test/*.js
REPORTER = spec
TIMEOUT = 20000
PATH := ./node_modules/.bin:$(PATH)
MOCHA = ./node_modules/mocha/bin/_mocha
COVERALLS = ./node_modules/coveralls/bin/coveralls.js

clean:
	@rm -rf node_modules

test:
	@mocha -r should -R $(REPORTER) -t $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-debug:
	@mocha --debug-brk -r should -R $(REPORTER) -t $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@istanbul cover --report html $(MOCHA) -- -t $(TIMEOUT) -r should -R spec $(TESTS)

test-coveralls:
	@istanbul cover --report lcovonly $(MOCHA) -- -t $(TIMEOUT) -r should -R spec $(TESTS)
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@cat ./coverage/lcov.info | coveralls && rm -rf ./coverage

test-all: test test-coveralls

.PHONY: test
