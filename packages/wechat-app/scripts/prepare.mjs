// @ts-check
import 'zx/globals'

const DEB_SRC = `https://home-store-packages.uniontech.com/appstore/pool/appstore/c/com.tencent.weixin/com.tencent.weixin_2.1.5_amd64.deb`

const wd = path.join(__dirname, '..', 'dist')
fs.ensureDirSync(wd)
cd(wd)
if (!fs.existsSync(path.join(wd, 'wechat.deb'))) {
  await $`wget ${DEB_SRC} -O wechat.deb`
}
await $`ar -x wechat.deb`
await $`tar -xf data.tar.xz`
await $`cp -r ../assets/license license`
await $`cp -r opt/apps/com.tencent.weixin/files/weixin/resources/app app`
