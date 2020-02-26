import {getAllVariantsOfPoses} from "./getAllVariantsOfPoses";
import {Tag} from "./types";

export interface MixedTag {
  tagNames: Array<string>,
  lighthouseFlags: LH.SharedFlagsSettings;
}

export type MixedTags = Array<MixedTag>;

export const getMixedTags = (tags: Array<Tag>): MixedTags => {
  const tagLengths = tags.map(tag => tag.values.length - 1);
  const allVariantsOfPoses = getAllVariantsOfPoses(tagLengths);
  // console.log(allVariantsOfPoses);

  const mixedTags: MixedTags = [];
  for (const poses of allVariantsOfPoses) {
    console.log(poses);
    const tagNames: Array<string> = [];
    let lighthouseFlags: LH.SharedFlagsSettings = {};
    for (const [i, pos] of poses.entries()) {
      const tag = tags[i].values[pos];
      tagNames.push(tag.name);
      lighthouseFlags = {...lighthouseFlags, ...tag.lighthouseFlags}
    }
    mixedTags.push({
      tagNames,
      lighthouseFlags,
    })
  }
  return mixedTags
};
