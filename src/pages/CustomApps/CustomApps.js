import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { AppList } from '../../components/AppList/AppList'
import { getLatestVersion } from '../../get-latest-version'
import { semverGt } from '../../semver-gt'

const query = {
    customApps: {
        resource: 'apps',
        params: {
            bundled: false,
        },
    },
    // TODO: Add ability to request certain app IDs to `/v2/apps` API and use
    // that instead
    appHub: {
        resource: 'appHub/v1/apps',
    },
}

export const CustomApps = () => {
    const { loading, error, data } = useDataQuery(query)

    if (error) {
        return (
            <NoticeBox
                error
                title={i18n.t(
                    'Something went wrong whilst loading your custom apps'
                )}
            >
                {error.message}
            </NoticeBox>
        )
    }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    const apps = data.customApps
        .filter(app => !app.bundled)
        .map(app => ({
            ...app,
            appHub:
                app.app_hub_id &&
                data.appHub.find(({ id }) => id === app.app_hub_id),
        }))
    const appsWithUpdates = apps.filter(
        app =>
            app.appHub &&
            semverGt(
                getLatestVersion(app.appHub.versions)?.version,
                app.version
            )
    )

    return (
        <AppList
            apps={apps}
            appsWithUpdates={appsWithUpdates}
            updatesAvailableLabel={i18n.t('Custom apps with updates available')}
            allAppsLabel={i18n.t('All installed custom apps')}
            searchLabel={i18n.t('Search installed custom apps')}
        />
    )
}
