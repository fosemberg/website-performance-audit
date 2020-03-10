import {measureSiteSpeed} from './measureSiteSpeed'
import {env} from "../../config/env";
import {InputExternal} from "../../config/types";

const second = 1000;
const minute = 60 * second;

describe("measureSiteSpeed", () => {
  test('measureSiteSpeed is working', async () => {

    const input: InputExternal = {
      iterations: 3,
      env: "trunk",
      site: "site-global",
      tag: "1.36",
    };

    // const measureSiteSpeedReturn = await measureSiteSpeed(input);
    // expect(measureSiteSpeedReturn).toBe(0);
    expect(await measureSiteSpeed(input)).toBe(0);
  }, 4 * minute);
});
