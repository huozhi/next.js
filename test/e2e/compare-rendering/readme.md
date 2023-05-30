sudo dtrace -n "profile-97/pid == 43234 && arg1/{ @[jstack(100, 8000)] = count(); } tick-2s { exit(0); }" -o app-out.stacks

oha http://localhost:3000/app/no-fetch/500 -z 500ms

~/workspace/tests/nextjs/FlameGraph/stackcollapse.pl app-out.stacks | ~/workspace/tests/nextjs/FlameGraph/stackcollapse.pl > app-rendering.svg
