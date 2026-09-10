import type { CompanionContentType } from "./types";

interface ReferenceableContent {
  id?: string;
  slug: string;
}

interface StoryRelation {
  type: CompanionContentType;
  id: string;
}

interface ReferenceableStory extends ReferenceableContent {
  related: StoryRelation[];
  title: string;
}

interface StoryRelationCollections {
  stories: readonly ReferenceableStory[];
  sameStyles: readonly ReferenceableContent[];
  schedules: readonly ReferenceableContent[];
  feeds: readonly ReferenceableContent[];
}

export function getCompanionContentId(item: ReferenceableContent): string {
  return item.id ?? item.slug;
}

export function validateStoryRelations(collections: StoryRelationCollections): string[] {
  const indexes: Record<CompanionContentType, Set<string>> = {
    story: new Set(collections.stories.map(getCompanionContentId)),
    "same-style": new Set(collections.sameStyles.map(getCompanionContentId)),
    schedule: new Set(collections.schedules.map(getCompanionContentId)),
    feed: new Set(collections.feeds.map(getCompanionContentId)),
  };

  const issues: string[] = [];

  for (const story of collections.stories) {
    const seen = new Set<string>();
    for (const relation of story.related) {
      const key = `${relation.type}:${relation.id}`;
      if (seen.has(key)) {
        issues.push(`${story.id}: duplicate relation ${key}`);
        continue;
      }
      seen.add(key);

      if (!indexes[relation.type].has(relation.id)) {
        issues.push(`${story.id}: unresolved relation ${key}`);
      }
    }
  }

  return issues;
}

