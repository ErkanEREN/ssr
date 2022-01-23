mkdir -p build/public/node/sourcemap/node
mkdir -p build/public/web/sourcemap/web/
mkdir -p build/server/sourcemap/server/

mv build/sourcemap/node build/public/node/sourcemap
mv build/sourcemap/web build/public/web/sourcemap
mv build/sourcemap/server build/server/sourcemap

rm -rf build/sourcemap