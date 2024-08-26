import { Box, Checkbox, ContentLayout, Flex, Link, SingleSelectOption, SingleSelect, Typography } from '@strapi/design-system';
import { CheckPagePermissions } from '@strapi/helper-plugin';
import range from 'lodash/range';
import React, { memo, useState } from 'react';

import { ExportButton } from '../../components/ExportButton';
import { Header } from '../../components/Header';
import { ImportButton } from '../../components/ImportButton';
import { Alerts } from '../../components/Injected/Alerts';
import { useI18n } from '../../hooks/useI18n';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { pluginPermissions } from '../../permissions';
import { dataFormats } from '../../utils/dataFormats';

const HomePage = () => {
  const { i18n } = useI18n();
  const { getPreferences, updatePreferences } = useLocalStorage();

  const [preferences, setPreferences] = useState(getPreferences());

  const handleUpdatePreferences = (key, value) => {
    updatePreferences({ [key]: value });
    setPreferences(getPreferences());
  };

  return (
    <CheckPagePermissions permissions={pluginPermissions.main}>
      <Header />

      <ContentLayout>
        <Flex direction="column" alignItems="start" gap={8}>
          <Box style={{ alignSelf: 'stretch' }} background="neutral0" padding="32px" hasRadius={true}>
            <Flex direction="column" alignItems="start" gap={6}>
              <Typography variant="alpha">{i18n('plugin.page.homepage.section.quick-actions.title', 'Quick Actions')}</Typography>

              <Box>
                <Flex direction="column" alignItems="start" gap={4}>
                  <Flex gap={4}>
                    <ImportButton />
                    <ExportButton availableExportFormats={[dataFormats.JSON_V2]} />
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Box>

          <Box style={{ alignSelf: 'stretch' }} background="neutral0" padding="32px" hasRadius={true}>
            <Flex direction="column" alignItems="start" gap={6}>
              <Typography variant="alpha">{i18n('plugin.page.homepage.section.preferences.title', 'Preferences')}</Typography>

              <Box>
                <Flex direction="column" alignItems="start" gap={4}>
                  <Flex justifyContent="space-between">
                    <Checkbox value={preferences.applyFilters} onValueChange={(value) => handleUpdatePreferences('applyFilters', value)}>
                      <Typography>{i18n('plugin.export.apply-filters-and-sort', 'Apply filters and sort to exported data')}</Typography>
                    </Checkbox>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <SingleSelect
                      label={i18n('plugin.export.deepness', 'Deepness')}
                      placeholder={i18n('plugin.export.deepness', 'Deepness')}
                      value={preferences.deepness}
                      onChange={(value) => handleUpdatePreferences('deepness', value)}
                    >
                      {range(1, 21).map((deepness) => (
                        <SingleSelectOption key={deepness} value={deepness}>
                          {deepness}
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Box>

          <Box style={{ alignSelf: 'stretch' }} background="neutral0" padding="32px" hasRadius={true}>
            <Flex direction="column" alignItems="start" gap={6}>
              <Typography variant="alpha">{i18n('plugin.page.homepage.section.need-help.title', 'Feature Request / Bug Report')}</Typography>

              <Typography variant="delta">Copyright &copy; BWDX Studio</Typography>
              <Box>
                <Flex direction="column" alignItems="start" gap={4}>
                  <Typography>{i18n('plugin.page.homepage.section.need-help.description', 'Feel free to reach out on the product roadmap, discord or github ✌️')}</Typography>
                  <Flex gap={4}>
                    <Link href="https://github.com/Stradivary" isExternal>
                      {i18n('plugin.page.homepage.section.need-help.github', 'GitHub')}
                    </Link>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </ContentLayout>

      <Alerts />
    </CheckPagePermissions>
  );
};

export default memo(HomePage);
