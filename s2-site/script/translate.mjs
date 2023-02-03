import translateDoc from "@stone-lyl/google-translate-script/src/translateDoc.mjs";
import { fileURLToPath } from "url";

translateDoc({
  fileName: '../../docs/manual/basic/sheet-type',
  dirname: fileURLToPath(import.meta.url),
  sourceSuffix: '.zh.md',
  projectInfo: {
    projectId: 'crested-sunup-368006',
  },
  isKeepHtml: true,
});
