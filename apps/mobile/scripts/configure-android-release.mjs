import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const androidDir = path.join(root, 'android');
const appGradle = path.join(androidDir, 'app', 'build.gradle');
const proguard = path.join(androidDir, 'app', 'proguard-rules.pro');

if (!fs.existsSync(appGradle)) {
  console.error('android/app/build.gradle 不存在，请先运行 expo prebuild');
  process.exit(1);
}

const sdkDir = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? `${process.env.HOME}/android-sdk`;
fs.writeFileSync(path.join(androidDir, 'local.properties'), `sdk.dir=${sdkDir}\n`);

let gradle = fs.readFileSync(appGradle, 'utf8');

if (!gradle.includes('keystorePropsFile')) {
  gradle = gradle.replace(
    'def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()',
    `def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()

def keystorePropsFile = new File(System.getProperty("user.home"), ".openchronicle/atlas-keystore.properties")
def keystoreProps = new java.util.Properties()
if (keystorePropsFile.exists()) {
    keystorePropsFile.withInputStream { keystoreProps.load(it) }
}`,
  );
}

if (!gradle.includes('signingConfigs.release')) {
  gradle = gradle.replace(
    `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`,
    `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (keystorePropsFile.exists()) {
                storeFile file(keystoreProps['storeFile'])
                storePassword keystoreProps['storePassword']
                keyAlias keystoreProps['keyAlias']
                keyPassword keystoreProps['keyPassword']
            }
        }
    }`,
  );
}

gradle = gradle.replace(
  'signingConfig signingConfigs.debug\n            def enableShrinkResources',
  'signingConfig signingConfigs.release\n            def enableShrinkResources',
);

fs.writeFileSync(appGradle, gradle);

const amapRules = `
# AMap SDK optional classes (location/GNSS) not used by this app
-dontwarn com.amap.**
-dontwarn com.autonavi.**
-dontwarn net.jafama.**
-dontwarn com.loc.**
-keep class com.amap.api.** { *; }
-keep class com.autonavi.** { *; }
`;

let rules = fs.readFileSync(proguard, 'utf8');
if (!rules.includes('dontwarn com.amap.**')) {
  rules += amapRules;
  fs.writeFileSync(proguard, rules);
}

console.log(`android release signing configured (sdk.dir=${sdkDir})`);
