import fs from 'fs';

import {env} from '../../config/env';
import grafanaConfig from '../../grafana/raw/site-performance.json';

const grafanaOutConfigFileName = 'site-performance.json';
const grafanaOutConfigDir = `${__dirname}/../../grafana/build`;
const grafanaOutConfigPath = `${grafanaOutConfigDir}/${grafanaOutConfigFileName}`;
const runnerPanelTitle = 'Runner';
const frontUrlVariableName = 'FRONT-URL';

const serverUrl = `${env.origin}:${env.port}`;
const frontIndexUrl = `${serverUrl}/static/index.html`;

grafanaConfig.__inputs.push({
  "name": frontUrlVariableName,
  "value": frontIndexUrl,
  "type": "constant",
  "label": "front url",
  "description": "url with front application"
});

grafanaConfig.panels = grafanaConfig.panels.map(
  // (panel) =>
    (panel: any) =>
    panel.title === runnerPanelTitle
      ? {
        ...panel,
        content: panel.content
          ? panel.content.replace(/https?:\/\/[^"]*/, `\${${frontUrlVariableName}}`)
          : '',
      }
      : panel
);

const outData = JSON.stringify(grafanaConfig, undefined, 2);

if (!fs.existsSync(grafanaOutConfigDir)) {
  fs.mkdirSync(grafanaOutConfigDir);
}

fs.writeFile(grafanaOutConfigPath, outData, (err) => {
  if (err) console.log(err);
});
