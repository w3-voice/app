TARGET?=android # defaults

build:
	go get golang.org/x/mobile/bind
	gomobile bind -ldflags '-s -w' -target $(TARGET) ./
	mv bridge.aar ../android/core/libs
	mv bridge-sources.jar ../android/core/libs
