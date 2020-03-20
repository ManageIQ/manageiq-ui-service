# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## Ivanchuk-4

- RBAC - use sui_dashboard_show instead of the sui_dashboard folder for VIEW dashboard permission [(#1611)](https://github.com/ManageIQ/manageiq-ui-service/pull/1611)

## Ivanchuk-3

### Fixed
- Fix chinese and brazilian locales [(#1588)](https://github.com/ManageIQ/manageiq-ui-service/pull/1588)
- Append the X-Requested-With (XHR) header to authentication requests [(#1612)](https://github.com/ManageIQ/manageiq-ui-service/pull/1612)
- Update ui-components to 1.2.16 for ivanchuk [(#1614)](https://github.com/ManageIQ/manageiq-ui-service/pull/1614)

## Ivanchuk-2

### Added
- Drop GTL switcher from Service Explorer breadcrumbs bar [(#1581)](https://github.com/ManageIQ/manageiq-ui-service/pull/1581)

### Fixed
- Fix stdout sanitization [(#1594)](https://github.com/ManageIQ/manageiq-ui-service/pull/1594)
- Update ui-components to 1.2.15 for ivanchuk [(#1605)](https://github.com/ManageIQ/manageiq-ui-service/pull/1605)
- DialogUser - use DialogData.outputConversion before submit and refresh [(#1606)](https://github.com/ManageIQ/manageiq-ui-service/pull/1606)

## Ivanchuk-1

### Added
- Add support for the VMRC remote consoles for VMware VMs [(#1570)](https://github.com/ManageIQ/manageiq-ui-service/pull/1570) 
- Update the VM remote console button to the new unified HTML5 console [(#1553)](https://github.com/ManageIQ/manageiq-ui-service/pull/1553)
- Support custom favicons [(#1521)](https://github.com/ManageIQ/manageiq-ui-service/pull/1521)

### Fixed
- Service detail screen - don't run automate methods [(#1551)](https://github.com/ManageIQ/manageiq-ui-service/pull/1551)
- Suspended power_state is "suspended" [(#1524)](https://github.com/ManageIQ/manageiq-ui-service/pull/1524)
- Timeline - remove onResize handler when destroying timeline [(#1523)](https://github.com/ManageIQ/manageiq-ui-service/pull/1523)

## Hammer-8 - Released 2019-07-02

### Fixed
- VM custom button dialog - use the VM instead of the parent service [(#1542)](https://github.com/ManageIQ/manageiq-ui-service/pull/1542)

## Hammer-5 - Released 2019-04-23

### Added
- Login/nav brand and logo are set by api [(#1513)](https://github.com/ManageIQ/manageiq-ui-service/pull/1513)

## Hammer-1 - Released 2019-01-15

### Added
- Updates language files includes new languages [(#1184)](https://github.com/ManageIQ/manageiq-ui-service/pull/1184)
- Adds loading spinner using pf-empty-state [(#1154)](https://github.com/ManageIQ/manageiq-ui-service/pull/1154)
- Added ability for login screen to clear password on failed attempt [(#1142)](https://github.com/ManageIQ/manageiq-ui-service/pull/1142)
- Updated RBAC and product features to support new structure [(#1090)](https://github.com/ManageIQ/manageiq-ui-service/pull/1090)
- Implement Generic Objects on services details page [(#996)](https://github.com/ManageIQ/manageiq-ui-service/pull/996)
- Update i18n catalog for hammer [(#1480)](https://github.com/ManageIQ/manageiq-ui-service/pull/1480)

### Fixed
- Duplicates retire modal from service explorer in service details view [(#1512)](https://github.com/ManageIQ/manageiq-ui-service/pull/1512)
- Unshift the placeholder message rather onto filtered tags [(#1510)](https://github.com/ManageIQ/manageiq-ui-service/pull/1510)
- Added ability for documentation to be dynamically configured [(#1505)](https://github.com/ManageIQ/manageiq-ui-service/pull/1505)
- Custom buttons - only show button name when the "Display on Button" option is set [(#1506)](https://github.com/ManageIQ/manageiq-ui-service/pull/1506)
- Service is getting retired without any confirmation in self service ui [(#1502)](https://github.com/ManageIQ/manageiq-ui-service/pull/1502)
- SSUI My Orders - Oder page has untranslated entries [(#1500)](https://github.com/ManageIQ/manageiq-ui-service/pull/1500)
- Fix retirement card on vm details page [(#1496)](https://github.com/ManageIQ/manageiq-ui-service/pull/1496)
- If tagging is readonly we should not show the edit dropdown [(#1497)](https://github.com/ManageIQ/manageiq-ui-service/pull/1497)
- Fix permission related display issues [(#1484)](https://github.com/ManageIQ/manageiq-ui-service/pull/1484)
- Restore action cable subscription, ensure enablement flag is available [(#1482)](https://github.com/ManageIQ/manageiq-ui-service/pull/1482)
- Updated URL for custom buttons dialogs [(#1467)](https://github.com/ManageIQ/manageiq-ui-service/pull/1467)
- Hide revert snapshot button for openstack vm's [(#1475)](https://github.com/ManageIQ/manageiq-ui-service/pull/1475)
- Changed Retire services to a modal instead of confirmation [(#1462)](https://github.com/ManageIQ/manageiq-ui-service/pull/1462)
- Fixed issue with retire modal coming up blank [(#1461)](https://github.com/ManageIQ/manageiq-ui-service/pull/1461)
- Update last retire call to make request [(#1459)](https://github.com/ManageIQ/manageiq-ui-service/pull/1459)
- Snapshot modal. Add support to hide memory checkbox [(#1455)](https://github.com/ManageIQ/manageiq-ui-service/pull/1455)
- Service retirement should use make retire as a request [(#1453)](https://github.com/ManageIQ/manageiq-ui-service/pull/1453)
- Removes whitespace that breaks translation [(#1439)](https://github.com/ManageIQ/manageiq-ui-service/pull/1439)
- Restores listview deafult row click behavior expanding row content [(#1416)](https://github.com/ManageIQ/manageiq-ui-service/pull/1416)
- Adds on-close to pf-notification-drawer component [(#1415)](https://github.com/ManageIQ/manageiq-ui-service/pull/1415)
- tolowercase of a null does not end well - breaks service explorer [(#1413)](https://github.com/ManageIQ/manageiq-ui-service/pull/1413)
- Fixes disk size misreporting for some disks [(#1410)](https://github.com/ManageIQ/manageiq-ui-service/pull/1410)
- Moved action button to the bottom of the form [(#1384)](https://github.com/ManageIQ/manageiq-ui-service/pull/1384)
- Create global variable for version of Patternfly [(#1379)](https://github.com/ManageIQ/manageiq-ui-service/pull/1379)
- Timelines: need to escape strings for the popover. [(#1370)](https://github.com/ManageIQ/manageiq-ui-service/pull/1370)
- Keep ui-components in sync with classic [(#1369)](https://github.com/ManageIQ/manageiq-ui-service/pull/1369)
- We were still disabling snapsot revert for all but the current snapshot [(#1367)](https://github.com/ManageIQ/manageiq-ui-service/pull/1367)
- Removes unnecessary header x-miq-group [(#1360)](https://github.com/ManageIQ/manageiq-ui-service/pull/1360)
- Enables user to revert snapshots that are parents [(#1358)](https://github.com/ManageIQ/manageiq-ui-service/pull/1358)
- Hides console buttons when indicated by server sans message [(#1354)](https://github.com/ManageIQ/manageiq-ui-service/pull/1354)
- Ensure service tag filters flagged for translation [(#1343)](https://github.com/ManageIQ/manageiq-ui-service/pull/1343)
- Fixed issue with custom button groups [(#1334)](https://github.com/ManageIQ/manageiq-ui-service/pull/1334)
- A dep no longer needed causes loading of angular too many times error [(#1295)](https://github.com/ManageIQ/manageiq-ui-service/pull/1295)
- Adds empty state to service details relationship section [(#1292)](https://github.com/ManageIQ/manageiq-ui-service/pull/1292)
- Ensure cloud_credential is captured for representation [(#1291)](https://github.com/ManageIQ/manageiq-ui-service/pull/1291)
- Ensure correct compliance icon 7 day timeline last hour utilization [(#1284)](https://github.com/ManageIQ/manageiq-ui-service/pull/1284)
- Added custom button menu to Resource Details page [(#1254)](https://github.com/ManageIQ/manageiq-ui-service/pull/1254)
- Apply standard to .ts resolve angular critical dependency error [(#1212)](https://github.com/ManageIQ/manageiq-ui-service/pull/1212)
- Ensure correct noVNC location is used [(#1208)](https://github.com/ManageIQ/manageiq-ui-service/pull/1208)
- Reconfigure custering of events to occur at 1  min interval [(#1182)](https://github.com/ManageIQ/manageiq-ui-service/pull/1182)
- Resource and menu action buttons on the same row [(#1179)](https://github.com/ManageIQ/manageiq-ui-service/pull/1179)
- Create resouce-detail md/sm viewport layouts [(#1175)](https://github.com/ManageIQ/manageiq-ui-service/pull/1175)
- Restores rbac permissiosn and camera eventicon [(#1168)](https://github.com/ManageIQ/manageiq-ui-service/pull/1168)
- Replace supports_launch_cockpit with supports_cockpit [(#1165)](https://github.com/ManageIQ/manageiq-ui-service/pull/1165)
- Clear user name field on failed login [(#1162)](https://github.com/ManageIQ/manageiq-ui-service/pull/1162)
- Adds done in efforts to fix travis timeout errors [(#1156)](https://github.com/ManageIQ/manageiq-ui-service/pull/1156)
- Updated support for launching cockpit and console [(#1132)](https://github.com/ManageIQ/manageiq-ui-service/pull/1132)
- Removed unnecessary filtercount functions from explorer views [(#1117)](https://github.com/ManageIQ/manageiq-ui-service/pull/1117)
- Ensure we only fetch those services with display set to true [(#1112)](https://github.com/ManageIQ/manageiq-ui-service/pull/1112)
- Uncapitalize repo name for playbooks [(#1098)](https://github.com/ManageIQ/manageiq-ui-service/pull/1098)
- Fixed issue with dialogs not loading on reconfigure [(#1478)](https://github.com/ManageIQ/manageiq-ui-service/pull/1478)

## Unreleased as of Sprint 100 ending 2018-12-03

### Fixed
- Fix gettext versus template strings [(#1503)](https://github.com/ManageIQ/manageiq-ui-service/pull/1503)

## Gaprindashvili-6 - Released 2018-11-02

### Fixed
- Snapshot modal. Add support to hide memory checkbox [(#1455)](https://github.com/ManageIQ/manageiq-ui-service/pull/1455)

## Gaprindashvili-5 - Released 2018-09-07

### Fixed
- Support for disabling Dashboard [(#1446)](https://github.com/ManageIQ/manageiq-ui-service/pull/1446)
- Fix for refresh of dialog fields not being called in some circumstances [(#1454)](https://github.com/ManageIQ/manageiq-ui-service/pull/1454)
- Fixed issue with dialogs that causes duplicate values [(#1458)](https://github.com/ManageIQ/manageiq-ui-service/pull/1458)

## Gaprindashvili-4 - Released 2018-07-16

### Fixed
- Updated custom button dialog url [(#1433)](https://github.com/ManageIQ/manageiq-ui-service/pull/1433)
- Change service dialog api call to match CUI [(#1438)](https://github.com/ManageIQ/manageiq-ui-service/pull/1438)
- Retirement & provisioning playbook does not duplicate details [(#1443)](https://github.com/ManageIQ/manageiq-ui-service/pull/1443)

## Gaprindashvili-3 - Released 2018-05-15

### Fixed
- Add missing translation tags to order details view [(#1344)](https://github.com/ManageIQ/manageiq-ui-service/pull/1344)
- Navigation menu highlighting [(#1385)](https://github.com/ManageIQ/manageiq-ui-service/pull/1385)
- Notifications should gated on sui_notification product feature [(#1293)](https://github.com/ManageIQ/manageiq-ui-service/pull/1293)
- Ensures service details custom buttons collapse to kebab when > 3 [(#1394)](https://github.com/ManageIQ/manageiq-ui-service/pull/1394)
- custom-button-menu component styling remains consistent [(#1395)](https://github.com/ManageIQ/manageiq-ui-service/pull/1395)
- Changed how breadcrumb shows up on catalog order page [(#1392)](https://github.com/ManageIQ/manageiq-ui-service/pull/1392)
- AuthenticationAPI - use base64encode which can deal with UTF8 passwords [(#1411)](https://github.com/ManageIQ/manageiq-ui-service/pull/1411)
- Refactors ansible credentials to be more generic, override with dialog input [(#1417)](https://github.com/ManageIQ/manageiq-ui-service/pull/1417)
- Fixed issue with custom button details dynamic field refresh [(#1423)](https://github.com/ManageIQ/manageiq-ui-service/pull/1423)

## Gaprindashvili-2 released 2018-03-06

### Fixed
- Refactors dashboard state resolve to return true on failed query [(#1372)](https://github.com/ManageIQ/manageiq-ui-service/pull/1372)
- Refactors dashboard state to a component [(#1373)](https://github.com/ManageIQ/manageiq-ui-service/pull/1373)
- Fixed dialog field dynamic refresh [(#1380)](https://github.com/ManageIQ/manageiq-ui-service/pull/1380)
- Create global variable for version of Patternfly [(#1379)](https://github.com/ManageIQ/manageiq-ui-service/pull/1379)
- Updated UI components version to remedy dialog select issue [(#1383)](https://github.com/ManageIQ/manageiq-ui-service/pull/1383)
- Pass additional information to the API when refreshing a dialog field [(#1324)](https://github.com/ManageIQ/manageiq-ui-service/pull/1324)

## Gaprindashvili-1 - Released 2018-01-31

### Added
- Added ability to hide toasts based on RBAC [(#1053)](https://github.com/ManageIQ/manageiq-ui-service/pull/1053)
- Added RBAC to App Launcher [(#1046)](https://github.com/ManageIQ/manageiq-ui-service/pull/1046)
- Added RBAC controls for Help menu [(#1043)](https://github.com/ManageIQ/manageiq-ui-service/pull/1043)
- Adds OS and Provider svgs [(#1040)](https://github.com/ManageIQ/manageiq-ui-service/pull/1040)
- Added ability to disable custom buttons and show disabled text [(#1012)](https://github.com/ManageIQ/manageiq-ui-service/pull/1012)
- Created githash saving and display functionality [(#1003)](https://github.com/ManageIQ/manageiq-ui-service/pull/1003)
- Allowed users to duplicate services [(#920)](https://github.com/ManageIQ/manageiq-ui-service/pull/920)
- Created Lifecycle menu [(#912)](https://github.com/ManageIQ/manageiq-ui-service/pull/912)
- Ensure unique url for service.resource-details update all instances [(#900)](https://github.com/ManageIQ/manageiq-ui-service/pull/900)
- Adds filter alias to dashboard retirement buttons [(#884)](https://github.com/ManageIQ/manageiq-ui-service/pull/884)
- Updated service reconfigure to use dialog component [(#877)](https://github.com/ManageIQ/manageiq-ui-service/pull/877)
- Extract and upload latest text for translation to zanata [(#876)](https://github.com/ManageIQ/manageiq-ui-service/pull/876)
- Updated custom button details to use Dialog Component [(#874)](https://github.com/ManageIQ/manageiq-ui-service/pull/874)
- Added ui-components Dialog to SUI [(#867)](https://github.com/ManageIQ/manageiq-ui-service/pull/867)
- Adds font fabulous dep [(#854)](https://github.com/ManageIQ/manageiq-ui-service/pull/854)
- Display colored fonticons before custom buttons [(#851)](https://github.com/ManageIQ/manageiq-ui-service/pull/851)
- Adds the reusable (and rather well executed) timeline component to the sui in addition to the timeline in the snapshots components [(#848)](https://github.com/ManageIQ/manageiq-ui-service/pull/848)
- Introduce service tag filtering [(#840)](https://github.com/ManageIQ/manageiq-ui-service/pull/840)
- Redesign vm details [(#831)](https://github.com/ManageIQ/manageiq-ui-service/pull/831)
- Adds create snapshot button on service details page [(#829)](https://github.com/ManageIQ/manageiq-ui-service/pull/829)
- Adds "View Graphs" link to service details [(#823)](https://github.com/ManageIQ/manageiq-ui-service/pull/823)
- Adds web access icon to Access dropdown [(#822)](https://github.com/ManageIQ/manageiq-ui-service/pull/822)
- Adds icon-status component [(#815)](https://github.com/ManageIQ/manageiq-ui-service/pull/815)
- Update angular patternfly [(#804)](https://github.com/ManageIQ/manageiq-ui-service/pull/804)
- Coveralls integration [(#802)](https://github.com/ManageIQ/manageiq-ui-service/pull/802)
- Make utilization graphs on VM details page [(#792)](https://github.com/ManageIQ/manageiq-ui-service/pull/792)
- Added ability to click hierachical child service [(#1339)](https://github.com/ManageIQ/manageiq-ui-service/pull/1339)

### Fixed
- Reorders when service catalog filter is built [(#1365)](https://github.com/ManageIQ/manageiq-ui-service/pull/1365)
- Fetch new users (group) authorizations rather than loading from session storage [(#1363)](https://github.com/ManageIQ/manageiq-ui-service/pull/1363)
- Ensure cloud_credential is captured for representation [(#1291)](https://github.com/ManageIQ/manageiq-ui-service/pull/1291)
- Move actioncable subcription creation to login promise chain [(#1314)](https://github.com/ManageIQ/manageiq-ui-service/pull/1314)
- Added Loading indicator to Dialogs [(#1258)](https://github.com/ManageIQ/manageiq-ui-service/pull/1258)
- Replace patternfly-sass with patternfly's sass [(#1331)](https://github.com/ManageIQ/manageiq-ui-service/pull/1331)
- Ensure the correct ansible play elapsed time is displayed [(#1326)](https://github.com/ManageIQ/manageiq-ui-service/pull/1326)
- Changed where Generic objects list gets rendered on Service details screen [(#1246)](https://github.com/ManageIQ/manageiq-ui-service/pull/1246)
- Fixed issue with custom button groups [(#1334)](https://github.com/ManageIQ/manageiq-ui-service/pull/1334)
- Added custom button menu to Resource Details page [(#1254)](https://github.com/ManageIQ/manageiq-ui-service/pull/1254)
- Adds empty state to service details relationship section [(#1292)](https://github.com/ManageIQ/manageiq-ui-service/pull/1292)
- A dep no longer needed, causes loading of angular too many times error [(#1295)](https://github.com/ManageIQ/manageiq-ui-service/pull/1295)
- Fixed issue with language not saving [(#1233)](https://github.com/ManageIQ/manageiq-ui-service/pull/1233)
- Update the changegroup action to set_current_group [(#12180)](https://github.com/ManageIQ/manageiq-ui-service/pull/1218)
- Use correct storage attribute, use metrics from last hour (not present) [(#1237)](https://github.com/ManageIQ/manageiq-ui-service/pull/1237)
- Fixed issue with buttons not supporting being disabled [(#1239)](https://github.com/ManageIQ/manageiq-ui-service/pull/1239)
- Updated the calculation for Chargebacks [(#1244)](https://github.com/ManageIQ/manageiq-ui-service/pull/1244)
- Updates sessionstorage when language is switched [(#1082)](https://github.com/ManageIQ/manageiq-ui-service/pull/1082)
- For logout If in production redirect to /ui/service/ if in dev route to /  [(#1073)](https://github.com/ManageIQ/manageiq-ui-service/pull/1073)
- Sets about modal isOpen to false on close [(#1071)](https://github.com/ManageIQ/manageiq-ui-service/pull/1071)
- DB/LDAP User is not able to log into SSUI [(#1061)](https://github.com/ManageIQ/manageiq-ui-service/pull/1061)
- Reorder build commands production env now set correctly for webpacking [(#1037)](https://github.com/ManageIQ/manageiq-ui-service/pull/1037)
- Replace 'Self Service' for 'Service UI' text [(#1030)](https://github.com/ManageIQ/manageiq-ui-service/pull/1030)
- Fixed issue for VM custom button actions [(#1022)](https://github.com/ManageIQ/manageiq-ui-service/pull/1022)
- Recalibrates snapshot timeline start/end for better visibility [(#1021)](https://github.com/ManageIQ/manageiq-ui-service/pull/1021)
- Added more detail when a order request fails [(#921)](https://github.com/ManageIQ/manageiq-ui-service/pull/921)
- Reconfigures tag query to prevent explorer filter failure [(#909)](https://github.com/ManageIQ/manageiq-ui-service/pull/909)
- Removed selectedMiqGroup session variable on logout [(#881)](https://github.com/ManageIQ/manageiq-ui-service/pull/881)
- Set leftBoundary as zero if there is nothing to display [(#875)](https://github.com/ManageIQ/manageiq-ui-service/pull/875)
- Bumped version of UI-components [(#871)](https://github.com/ManageIQ/manageiq-ui-service/pull/871)
- Buttons are updated on power operations [(#844)](https://github.com/ManageIQ/manageiq-ui-service/pull/844)
- The VM status shows "retired" for all VM's [(#856)](https://github.com/ManageIQ/manageiq-ui-service/pull/856)
- Service.custom_button_details state params cleaned [(#838)](https://github.com/ManageIQ/manageiq-ui-service/pull/838)
- Gracefully handle 403 state change error [(#833)](https://github.com/ManageIQ/manageiq-ui-service/pull/833)
- Resolves production redirect error on logout [(#828)](https://github.com/ManageIQ/manageiq-ui-service/pull/828)
- Utilization graphs now react to any change in data [(#825)](https://github.com/ManageIQ/manageiq-ui-service/pull/825)
- Error loading services without vms [(#812)](https://github.com/ManageIQ/manageiq-ui-service/pull/812)
- Fixed button link formatting [(#803)](https://github.com/ManageIQ/manageiq-ui-service/pull/803)
- Removed code climate conditional execution [(#800)](https://github.com/ManageIQ/manageiq-ui-service/pull/800)
- Fix for service catalog service dialog refresh function behaving differently [(#793)](https://github.com/ManageIQ/manageiq-ui-service/pull/793)
- Login and page refresh not working [(#774)](https://github.com/ManageIQ/manageiq-ui-service/pull/774)
- Adds support for custom brand [(#769)](https://github.com/ManageIQ/manageiq-ui-service/pull/769)
- Filter tooltip overflow [(#753)](https://github.com/ManageIQ/manageiq-ui-service/pull/753)
- Buttons are updated on power operations [(#844)](https://github.com/ManageIQ/manageiq-ui-service/pull/844)
- The VM status shows "retired" for all VM's [(#856)](https://github.com/ManageIQ/manageiq-ui-service/pull/856)
- Sort tags by name alphabetically [(#1190)](https://github.com/ManageIQ/manageiq-ui-service/pull/1190)
- Specify category-select toggle width, prevent it from hidng [(#1191)](https://github.com/ManageIQ/manageiq-ui-service/pull/1191)
- Adds support for supports_vnc_console decorator [(#1195)](https://github.com/ManageIQ/manageiq-ui-service/pull/1195)
- "filter", is correct option, subquery_count (to display filter results) [(#1220)](https://github.com/ManageIQ/manageiq-ui-service/pull/1220)
- Ensured tooltips do not show when drop downs are open [(#1345)](https://github.com/ManageIQ/manageiq-ui-service/pull/1345)
- Fixed issue with adding to cart not working [(#1347)](https://github.com/ManageIQ/manageiq-ui-service/pull/1347)
- Ensure service tag filters flagged for translation [(#1343)](https://github.com/ManageIQ/manageiq-ui-service/pull/1343)

## Fine-4

### Fixed
- Buttons are updated on power operations, but don't disappear [(#844)](https://github.com/ManageIQ/manageiq-ui-service/pull/844)
- The VM status shows "retired" for all VM's , retired or not [(#856)](https://github.com/ManageIQ/manageiq-ui-service/pull/856)
- DB/LDAP User is not able to log into SSUI [(#1061)](https://github.com/ManageIQ/manageiq-ui-service/pull/1061)

## Fine-3

### Fixed
- Added support for a vm to submit a custom button action [(#791)](https://github.com/ManageIQ/manageiq-ui-service/pull/791)
- Allows for image assets to be dynamically skinned [(#790)](https://github.com/ManageIQ/manageiq-ui-service/pull/790)
- Fix for service catalog service dialog refresh function behaving differently [(#814)](https://github.com/ManageIQ/manageiq-ui-service/pull/814)
- Unify console names between ops & service UI - VM Console & Web Console [(#819)](https://github.com/ManageIQ/manageiq-ui-service/pull/819)
- Ensure action target collection matches button class [(#837)](https://github.com/ManageIQ/manageiq-ui-service/pull/837)
- Fixes an issue with polling causing issues with data not rendering properly [(#842)](https://github.com/ManageIQ/manageiq-ui-service/pull/842)

## Fine-2

### Added
- Added custom buttons to VM details page [(#750)](https://github.com/ManageIQ/manageiq-ui-service/pull/750)

### Fixed
- Refresh button in a dialog does not show in SUI [(#752)](https://github.com/ManageIQ/manageiq-ui-service/pull/752)
- Sending string true vs literal true [(#771)](https://github.com/ManageIQ/manageiq-ui-service/pull/771)
- Enabled session timeout on pages that poll [(#773)](https://github.com/ManageIQ/manageiq-ui-service/pull/773)
- Ensures ansible service displays vm resources [(#776)](https://github.com/ManageIQ/manageiq-ui-service/pull/776)

## Fine-1

- (bug) [MOCK] Fix broken images in mock API
- (bug) Change to "link pointy hand" when mouse over tile
- (bug) Tooltip in self service portal shows code
- (bug) Pagination controls get pushed off screen
- (bug) Fix vertical alignment issues in toolbars
- (bug) BZ 1443707 - Sort "My Service" page based on created time
- (bug) Fix pagination alignment with offset
- (bug) Stop repeating "service retired message"
- (bug) BZ#1441861 - console open error
- (bug) BZ#1443346-Hover text misaligned for service list vms
- (bug) BZ#1439632 - Display pretty credential type
- (bug) Orders should be "My Orders"
- (bug) Users should be able to click anywhere on the row to drill down on a service
- (bug) Dashboard is missing information on Orders
- (bug) BZ#1392096 update translations
- (bug) Approve and Deny Order not working 
- (bug) Doesn't time out when session timeout is reached
- (bug) BZ#1439309-incorrectly displaying orders tab
- (bug) BZ 1435468 - Certain users with special attributes can't log in to services UI.
- (bug) BZ#1446408 -filter tooltip overflow
- (bug) BZ#1446405 - manageiq icon
- (bug) BZ 1445939 - MIQLDAP - FreeIPA - Can't switch groups in SSUI
- (bug) BZ#1447789 - catalog results should show number of templates, not catalogs
- (bug) List views don't scroll, have odd padding, master and fine
- (bug) BZ#1442616 - Inaccurate representation of translations available
- (feature) Update vm details page
- (feature) Add performance / utilization graphs on service page
- (feature) Optimize batch action notifications
- (feature) Add timeline to snapshots page
- (feature) Add custom buttons on details page
- (bug)  (Cockpit and HTML5) are inconsistent between Service and OPS UI
- (bug) Change "Catalogs" to "Service Catalog"
- (bug) Change "Service" to "My Service"
- (bug) Parity additions for edit tags modal
- (bug) User can create a catalog
- (bug) Ensure accurate status reporting for all collection/subcollection actions
- (bug) Hover text is not present on Service details page
- (bug) Only stack name should be shown in relationships table for stack VM
- (bug) Incorrect status reporting for snapshots
- (bug) BZ#1441425 - Last run report should be listed first
- (bug) Change "Service Catalogs" in vertical navigation to "Service Catalog"
- (bug) Wrong pending request count displayed in dashboard
- (bug) When using dynamic drop downs, sorting of items doesn't work
- (bug) Fix missing data in Mock API
- (bug) Hide report tab
- (bug) Remove list view for Service Catalog
- (bug) Remove tile view from My Services
- (bug) Remove configuration button on catalog page
- (bug) Remove "filtering by number of VMs"
- (bug) Left element alignment wrong
- (bug) Add nl2br in the Ansible stdOut feed
- (bug) BZ#1440931 - reject login for user without privileges
- (bug) VM Details page taking too long to load on Cloud instances
- (bug) Cockpit console does not open
- (bug) Self Service UI does not properly select defaults for dynamic drop downs
- (bug) Arrow should align to kebab menu
- (bug) [MOCK] Fix stdOut data
- (feature) RBAC support for custom buttons
- (feature) Add ability to filter by Catalog Name
- (feature) Flatten action and custom actions for service details
- (bug) Dialog field visibility is not honored on dynamic fields in Service UI
- (bug) RBAC: Catalog Menu should be hidden or it should show Dashboard when no permissions
- (feature) Create Report Explorer
- (feature) Create Report Detail Page
- (feature) Create Report View page
- (feature) [UI] Hide Dialog Editor
- (feature) [API] Move mock-api to new repo
- (chore) Update Deps
- (bug) Service toolbar actions should be disabled if no service is selected
- (feature) Enable RBAC on Services Explorer Page
- (bug) BZ#1438025 persist catalog view state during session
- (bug) Dynamic check box does not update
- (bug) Left nav tooltips broken
- (feature) Order requests by most recent date
- (bug) BZ#1429311 - Address unexpected duplicate cart activity
- (feature) Update stdout for ansible service
- (bug) Fix Broken images in Mock api 
- (feature) Changed how we define dependencies in Package.json
- (bug) BZ#1429650 - External authentication works when logging into the Admin UI but doesn't work for the same user to get into the Service UI
- (chore) Adjust .travis.yml to test LTS and current version of Node
- (bug) BZ#1438554 state reload on login
- (bug) RBAC : Not able to see orders when not enough permission to see catalogs
- (feature) Enable RBAC on Service Detail Page
- (bug) Initial explorer result counts are delayed
- (bug) Cockpit icon tooltip gets in the way of button click
- (feature) Hover text on request status should indicate the status (Approved/Denied)
- (bug) BZ#1439396 - unclickable service cards
- (bug) Catalogs show counting of Service who are set to "don't display in Catalog"
- (feature) [UI] Add "Retire Now" to kebab menu for a resource
- (chore) Update yarn in system to latest version
- (bug) Fix dynamic service dialog validations
- (bug) BZ#1439672 tnav button overlap
- (bug) BZ#1439848 - hide list helpers in card view, catalogs
- (bug) Snapshot counter at Service level is not set
- (bug) BZ#1439864 - remove required description indicator from create snapshot
- (bug) BZ#1439844 - Fix navigation rbac
- (feature) [UI] Add Power Management button to VM details page also BZ#1439555
- (bug) Unable to delete a new tab in dialog
- (feature) Enable RBAC on Orchestration Templates
- (bug) Empty page during Breadcrumb navigation on Dialogs page
- (bug) Hover text is hiding Download button on Template Summary page
- (feature) Enable RBAC on Requests Tab
- (feature) Enable RBAC on Catalog Tab
- (feature) Enable RBAC on Orders Tab
- (bug) Hand pointer without clickable link on power state icon on Service page
- (feature) Enable RBAC on Main Nav
- (chore) Update Deps
- (bug) Catalog Edit :Either of Cancel and "Do not Save" should be there 
- (bug) Service dialog dynamic code does not work
- (feature) Add an equivalent for the secure_headers for the assets
- (bug) Fix obscene expanded row view
- (bug) Tags not sorted while tagging services
- (feature) product-info & service-info don't need to return promises
- (feature) [UI] Restore VMware VM from snapshot
- (bug) Hand pointer without clickable link on SSUI Template page
- (bug) BZ#1431865
- (feature) Add ansible job details to service
- (bug) Ensure that menu item titles get translated
- (feature) Catalog employ cardview by default
- (feature) Remove Templates tab
- (bug) Disabled vm resource actions shouldn't be executed
- (feature) BZ#1435364 Post order routing
- (feature) [UI] Show Retired vs. Non-Retired on Service details
- (feature) [UI] Edit Orchestration Template
- (bug) Remove toastr modal errors.
- (feature) [UI] Remove Orchestration Template
- (bug) Remove 'products' state
- (bug) [MOCK] Add Mock data for VM details
- (bug) Edit Dialog is broken
- (feature) [UI] Add TypeScript support in Webpack
- (bug) Unable to add Catalog items to cart
- (bug) Fix the wonky cart
- (feature) Bootstrap Hybrid Application
- (feature) [UI] Create ability to view Orchestration Template
- (feature) [UI] Copy Orchestration Template
- (bug) Templates bugs
- (bug) Fix Dialog create
- (feature) Add reset option to catalog edit
- (bug) Ensure embedded forms use correct action button directions
- (bug) Polling on Requests tab causes rows to reorder
- (bug) HTML5 console does not work for non-admin user in SUI
- (bug) BZ#1428956
- (feature) [MODEL] Add picture to OrchestrationTemplate
- (bug) Cancel button on catalog edit is broken
- (bug) Dashboard Filter should be removed when directly going to the menu
- (bug) Approved Service link on Dashboard does not show correct data
- (bug) Save button is not enabled in "retire service at date" page
- (bug) Template icons not showing up template explorer
- (bug) Fix cutoff kebab menu being cutoff
- (bug) My requests missing 'Last Message' field
- (bug) Dialog edit switch button errors
- (bug) Fix image path for cockpit.png on Euwe
- (bug) Service Dialog - Element visibility on condition is not working in Self-Service portal 
- (bug) MyOrder- Extra column of order is shown for the first provisioning request raised
- (bug) Error creating duplicate catalog
- (bug) Catalog "save" button on Edit page is not enabled unless description is filled
- (bug) Current Service link on dashboard should show all current active services
- (bug) $state.FeatureNav error when reloading a view
- (feature) [UI] myService Details - Specific Info for Ansible Services
- (feature) [API] Create Catalog item
- (feature) Change of "Memory on Disk" metric name
- (feature) [UI] Separate out current karma tests in own dir
- (feature) [UI] List Orchestration Templates
- (feature) [UI] List Snapshots (for specific VMware VM's)
- (feature) [UI] Delete VMware Snapshot
- (feature) [UI] Delete all VMware Snapshots for VM
- (feature) [UI] Rework Folder Structure as per updated tabs
- (bug) Edit dialog page does not display correct fields
- (bug) [UI] Fix "Ordered On" date in /orders
- (bug) [UI] Fix "Created On" date in /services
- (bug) [UI] Fix "Updated" date in /templates
- (bug) [UI] Pagenation and total items are not aligned at bottom of page
- (bug) [UI] Remove Admin tab
- (bug) [UI] Fix label getting scrunched in /templates
- (feature) [UI] Create Orchestration Template
- (feature) [UI] myServices - Bulk Edit Tags
- (feature) [UI] Services - Bulk  Set Ownership
- (feature) [UI] Services - Bulk Retire Now
- (feature) [UI] Services - Bulk Retire Later
- (feature) [UI] Services - Bulk Delete
- (feature) [UI] Create VMware Snapshot
- (bug) Snapshot delete all yields vm deletion
- (bug) [MOCK] Fix pictures not showing in Mock API
- (bug) [UI] Store MIQ Group info in session for authenticated user
- (chore) Update Dependencies
- (bug) MyOrder- Remove button of the last order is not visible
- (feature) [UI] Switch to use angular-patternfly-sass so patternfly variables are available
- (feature) Make All links working on dashboard tab
- (feature) [API] VM / Services Bulk Tag Assign
- (feature) [UI] Merge the Service Catlogs / Design Catalogs screen
- (bug) ManageIQ icon is being used on browser tab
- (bug) No action on clicking link "Service Explorer"
- (bug) "MyService" is displayed instead of "Service Explorer"
- (feature) [UI] Remove "My" from the tabs / update breadcrumbs
- (bug) Pagination is broken
- (bug) [URGENT] Fix skinning issue with symlinks
- (feature) [API] Add additional validation to Pictures API
- (bug) Refactor vertical navigation to support dynamic translations and badge counts
- (feature) [UI] Add initial polling refresh to pages
- (feature) [API] VM & Services Bulk Tag Unassign
- (feature) Update Deps
- (feature) [BOT] Auto-label (or unlabel) WIP PRs
- (bug) No cockpit icon for VM's in Service details page 
- (bug) Save and Cancel button on catalog page should be right aligned as in other pages
- (feature) Remove dialogs from designer state (and designer state from app)
- (bug) [UI] Default image from custom catalogs not being shown
- (bug) Catalog card style not looking right
- (bug) Request Explorer shows "Pending approval" requests by default
- (feature) [UI] Remove service designer
- (feature) [UI] Remove Catalog Item
- (feature) [UI] Edit Catalog item
- (feature) [UI] Breadcrumb component
- (bug) Notification keeps on showing "there was error loading service"
- (bug) Cockpit console "Unable to connect"
- (bug) Correct Power Operations on VM need to be enabled
- (chore) Make SUI Heroku capable 
- (bug) console options can be clicked  when disabled
- (feature) Mock-api general improvements
- (feature) [UI] myServices List View Updates
- (feature) Mock api not returning data for certain endpoints
- (feature) [DESIGN] myServices - List View (General Info)
- (feature) [UI] Configure webpack for production usage
- (bug) SUI not navigation to Service Catalogs or Designer - Blueprints pages
- (bug) Remove unnused 'blocks' modules
- (bug) Ensure production webpack builds css js into respective folders
- (bug) When logged in as non-admin user, polling requests are made for forbidden resources
- (bug) [UI] Fix toastr messages
- (feature) [UI] Ability to export a canvas
- (bug) BZ - 1406945 Hand pointer in the VM section
- (chore) Refactor: add explicit import/exports and convert from scripts to modules
- (feature) [DESIGN] Reject Requests
- (feature) Create logging functionality in Mock API system
- (feature) [DESIGN] Dialog Editor Design - Support Enhancements
- (bug) Error on incorrect login
- (bug) Error when closing Modals
- (feature) [API] Remove approver
- (feature) Update PR# 54 as per comments
- (bug) Fix e2e test failure on forks with no sauce credentials set for travis ci
- (bug) Switch Language : Not all texts are translated when switched language
- (feature) [UI] Update details info of service in catalog
- (feature) [UI] Update My Orders Screen
- (feature) [MODEL] Add tagging to catalog model
- (feature) Reduce bundle size - remove blueprints
- (feature) [DESIGN] General breadcrumb and view selector design for entire SUI
- (feature) [API] Search
- (feature) Add Polling to my Orders Page
- (chore) [Task] Pull up essential modules into core module
- (feature) Add Local folder support to Mock API
- (feature) Add Support for http status codes on Mock API
- (feature) [UI] Allow viewing of marketplace without login
- (bug) Fix WARN [proxy]: failed to proxy messages in Travis
- (feature) Update Navigation Tab Structure
- (bug) Service Reconfigure page not pre-populated
- (feature) [UI] Update Routing for new tabs
- (feature) [UI] Remove arbitration profiles
- (feature) [MODEL] Class methods on ServiceTemplate to create all resources of a Catalog Item
- (bug) [UI] Skinning is broken
- (feature) [UI] Edit Service Tags
- (feature) [API] Load Balancers endpoint
- (feature) [UI] List existing catalogs (Designer views available service catalogs)
- (feature) [UI] Publish Blueprint
- (feature) [DESIGN] Set the Start & Stop actions, delays, and dependancies for each item within a blueprint
- (bug) [UI] Replace extend:false with hide:resources
- (feature) [UI] Enable Service Designer
- (feature) [UI] Designer creates a new service catalog
- (feature) [UI] Designer edits an existing service catalog
- (feature) [UI] Designer deletes a service catalog 
- (feature) [UI] Approve/Deny Requests
- (feature) [UI] Add additional information to VM details
- (bug) Modals not closing on state transition
- (bug) Broken request details state, convoluted explorer states
- (feature) [API] Request workflow
- (feature) [UI] Refactoring modals to use components
- (chore) [BOT] Install and configure UI bot
- (feature) [UI] Include Babel in build process
- (feature) Update dependancies for Sprint 51
- (feature) [API] Copy Orchestration Template
- (feature) Employ absolute versioning for dependencies
- (bug) [UI] Children services are not displayed in "My services"
- (feature) [BOT] PT flow and checking
- (feature) [UI] Include webpack in build process
- (feature) Update Angular to 1.6.1 and breaking tests
- (bug) Address WARN [proxy] in build
- (feature) [DESIGN] Fix My Orders screen
- (feature) [DESIGN] Dialog Editor Redesign
- (bug) [UI] Detail Request page of type 'VM Provision' does not render the details due to a possible undefined value
- (feature) [API] allowed tags endpoint for the request workflow
- (feature) [API] Request Workflow class name endpoint
- (bug) Browsersync is not respecting other ports
- (feature) Add yarn autotest to replace gulp autotest
- (feature) [DESIGN] myService Headings (Associated Resources)
- (feature) [DESIGN] myService Utilization
- (feature) [DESIGN] myService Details - Specific info for Ansible Services
- (feature) [DESIGN] Update the SUI Dashboard
- (feature) [UI] Edit Request
- (bug) [API] Sort by Virtual Attributes
- (feature) [DESIGN] myService Details - Generic info for all Services
- (bug) [UI] Login page shows RoutingError 
- (bug) BZ 1409959 
- (feature) [UI] Allow user to launch other ManageIQ UIs
- (feature) [DESIGN] Allow user to launch other ManageIQ UIs
- (feature) [SPIKE] Investigate component-izing Topology Widget
- (feature) [UI] Remove gulp
- (feature) [UI] Implement Karma-Webpack
- (feature) Create Karma / Protractor tests
- (bug) [API] Fix the API endpoint for requests when attribute=v_allowed_tags and workflow=nil 
- (bug) Lock version of dependencies in yarn.lock
- (bug) Bug 1405143 - SSUI: Open a HTML5 console for vm broken in SSUI
- (chore) [ADMIN] Remove SCSS Linting from Hound
- (bug) Fix SCSS lint issues
- (feature) [UI] Get info of service
- (feature) [API] Edit Request
- (feature) [UI] Explorer Buttons: Life Cycle
- (feature) [API] Add approver
- (feature) [API] Copy Order
- (feature) Account for DialogFieldTagControl in Dialog Update
- (feature) [UI] Update angular-ui-bootstrap to latest
- (feature) [UI] View Requests
- (feature) [UI] Paginate "My Requests"
- (feature) [UI] Remove Items from Catalog
- (feature) [UI] Update to jQuery 3.1.x
- (feature) [DESIGN] myServices - Children Services
- (bug) [MODEL] Publish Blueprint error
- (feature) [DESIGN] Ability to zoom in/out while looking at the canvas
- (feature) [DESIGN] Designer views available service catalogs
- (feature) [DESIGN] Designer edits a service catalog
- (feature) [DESIGN] Designer deletes a service catalog
- (feature) [DESIGN] Designer creates a new service catalog
- (feature) [DESIGN] Ability to export a canvas
- (feature) [MODEL] Update ui_properties with Service Template IDs 
- (feature) [MODEL] Add "in use" virtual attribute to Blueprint 

## Euwe-1

- (bug) Bug 1395981
- (feature) Update dependencies
- (chore) Fix Chrome/Firefox font file console warning
- (bug) Fix dashboard service and request links
- (feature) [UI] Explorer Buttons: Configuration
- (feature) [UI] Show information about VM
- (feature) [UI] Set Owner of service
- (feature) [DESIGN] Create Catalog Item Bundle
- (feature) [DESIGN] Create Catalog item 
- (feature) [DESIGN] Catalog Item - add/edit tags
- (feature) [UI] Build Icon list component
- (bug) My Services -> List, # of services is cutoff
- (feature) [UI] Remove Service
- (feature) [UI] Retire Service
- (feature) [API] Return IDs in content of Dialogs Subcollection
- (feature) [DESIGN] View Catalog Item 
- (feature) [UI] View Catalog Item 
- (feature) [DESIGN] Add Tag to blueprint
- (feature) [API] Publish Blueprint
- (feature) [UI] Remove Tag from blueprint
- (feature) [UI] Add Tag to blueprint
- (feature) [DESIGN] Add Items to Catalog
- (feature) [UI] Add Items to Catalog
- (feature) [DESIGN] List all services
- (feature) [UI] Set Retirement of service
- (feature) [UI] Edit Service
- (feature) [DESIGN] Set the action & provision order of items within a blueprint
- (feature) [UI] Set the action & provision order of items within a blueprint
- (feature) [UI] List all services

## Initial changelog added
