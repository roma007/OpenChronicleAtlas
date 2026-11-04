import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
          <Link
            to="/"
            className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
          >
            ← 返回
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-wider text-ink">
            隐私政策
          </h1>
          <p className="mt-2 text-xs text-ink-soft/70">更新日期：2026-11-04</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-5 py-8 text-sm leading-7 text-ink-soft sm:px-8">
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink">1. 我们收集什么</h2>
          <p>
            本应用不要求注册账号，不收集姓名、手机号、邮箱等个人身份信息。
            专题数据为静态历史资料，不包含个人信息。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-ink">2. 高德地图 SDK</h2>
          <p>
            本应用使用高德地图 SDK 提供地图展示服务。SDK 提供者为
            <strong className="text-ink"> 高德软件有限公司</strong>，可能收集设备信息、网络信息、
            地图交互所需的信息（本版本不申请定位权限），用于地图渲染、坐标转换与服务可用性保障。
          </p>
          <p>
            高德地图开放平台隐私权政策：
            <a
              className="text-cinnabar underline underline-offset-2"
              href="https://lbs.amap.com/pages/privacy/"
              target="_blank"
              rel="noreferrer noopener"
            >
              https://lbs.amap.com/pages/privacy/
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-ink">3. 权限说明</h2>
          <p>
            当前版本不申请定位权限，也不读取通讯录、相册、麦克风等与功能无关的权限。
            如未来启用「我的位置」，会在使用前单独征得你的同意，并更新本政策。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-ink">4. 分享链接</h2>
          <p>
            分享链接仅包含专题、时间点、事件与地图视野参数，不包含任何个人身份信息。
            链接由你主动分享，我们不做访问统计。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-ink">5. 数据存储与第三方</h2>
          <p>
            专题数据以静态文件形式托管，通过 CDN 分发。除高德地图 SDK 外，本应用不集成广告、
            统计或用户画像类第三方 SDK。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-ink">6. 联系我们</h2>
          <p>
            如对本政策有疑问，请通过项目仓库
            <a
              className="text-cinnabar underline underline-offset-2"
              href="https://github.com/roma007/OpenChronicleAtlas"
              target="_blank"
              rel="noreferrer noopener"
            >
              {' '}
              GitHub Issues{' '}
            </a>
            联系我们。
          </p>
        </section>
      </main>
    </div>
  );
}
