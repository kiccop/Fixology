
import { LucideIcon, Rocket, Activity, Bike, Wrench } from 'lucide-react'

export type GuideCategory = 'basics' | 'integrations' | 'bikes' | 'maintenance'

export interface GuideTopic {
    slug: string
    icon: LucideIcon
    category: GuideCategory
    translationKey: string
}

export const guideTopics: GuideTopic[] = [
    {
        slug: 'introduction',
        icon: Rocket,
        category: 'basics',
        translationKey: 'topics.introduction'
    },
    {
        slug: 'connecting-strava',
        icon: Activity,
        category: 'integrations',
        translationKey: 'topics.connecting_strava'
    },
    {
        slug: 'adding-bike',
        icon: Bike,
        category: 'bikes',
        translationKey: 'topics.adding_bike'
    },
    {
        slug: 'managing-components',
        icon: Wrench,
        category: 'maintenance',
        translationKey: 'topics.managing_components'
    }
]
