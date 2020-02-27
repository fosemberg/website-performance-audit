import {getAllVariantsOfPoses} from "./getAllVariantsOfPoses";
import {TagWithValues} from "./types";

interface Tag {
  name: string,
  value: string,
}

export interface MixedTag {
  tags: Array<Tag>,
  lighthouseFlags: LH.SharedFlagsSettings;
}

export type MixedTags = Array<MixedTag>;

export const getMixedTags = (tagsWithValues: Array<TagWithValues>): MixedTags => {
  const tagLengths = tagsWithValues.map(tag => tag.values.length - 1);
  const allVariantsOfPoses = getAllVariantsOfPoses(tagLengths);

  const mixedTags: MixedTags = [];
  for (const poses of allVariantsOfPoses) {
    const tags: Array<Tag> = [];
    let lighthouseFlags: LH.SharedFlagsSettings = {};

    for (const [i, pos] of poses.entries()) {
      const tagWithValues = tagsWithValues[i];
      const tagName = tagWithValues.name;
      const value = tagWithValues.values[pos];
      const valueName = value.name;
      tags.push({
        name: tagName,
        value: valueName,
      });
      lighthouseFlags = {...lighthouseFlags, ...value.lighthouseFlags}
    }

    mixedTags.push({
      tags,
      lighthouseFlags,
    })
  }

  return mixedTags;
};
