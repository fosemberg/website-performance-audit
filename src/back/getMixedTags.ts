import {getAllVariantsOfPoses} from "./getAllVariantsOfPoses";
import {TagWithValues} from "../../config/types";

interface Tags {
  [key: string]: string;
}

export interface MixedTag {
  tags: Tags,
  lighthouseFlags: LH.SharedFlagsSettings;
}

export type MixedTags = Array<MixedTag>;

export const getMixedTags = (tagsWithValues: Array<TagWithValues>): MixedTags => {
  const tagLengths = tagsWithValues.map(tag => tag.values.length - 1);
  const allVariantsOfPoses = getAllVariantsOfPoses(tagLengths);

  const mixedTags: MixedTags = [];
  for (const poses of allVariantsOfPoses) {
    const tags: Tags = {};
    let lighthouseFlags: LH.SharedFlagsSettings = {};

    for (const [i, pos] of poses.entries()) {
      const tagWithValues = tagsWithValues[i];
      const tagName = tagWithValues.name;
      const value = tagWithValues.values[pos];
      const valueName = value.name;
      tags[tagName] = valueName;
      lighthouseFlags = {...lighthouseFlags, ...value.lighthouseFlags}
    }

    mixedTags.push({
      tags,
      lighthouseFlags,
    })
  }

  return mixedTags;
};
