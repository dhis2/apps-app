import React from 'react';

import Avatar from 'material-ui/lib/avatar';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';

import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';

import actions from '../actions';

export default React.createClass({
    propTypes: {
        installedApps: React.PropTypes.array.isRequired,
        uploadProgress: React.PropTypes.func.isRequired,
        transitionUnmount: React.PropTypes.bool.isRequired,
        showUpload: React.PropTypes.bool.isRequired,
    },

    contextTypes: {
        d2: React.PropTypes.object,
    },

    componentDidMount() {
        setTimeout(() => {
            this.setState({componentDidMount: true});
        }, 0);

        actions.installApp.subscribe(() => {
            if (this.form) {
                this.form.reset();
            }
        });
    },

    getInitialState() {
        return {
            componentDidMount: false,
            uploading: false,
        };
    },

    render() {
        const d2 = this.context.d2;
        const styles = {
            container: {
                borderBottom: '1px solid #dddddd',
                paddingBottom: 0,
                marginBottom: 8,
            },
            fab: {
                position: 'fixed',
                left: 0,
                bottom: 16,
                right: 16,
                maxWidth: 1200,
                textAlign: 'right',
            },
            fabAnim: {
                float: 'right',
            },
            noApps: {
                marginTop: 16,
                textAlign: 'center',
                fontWeight: 100,
                fontSize: 15,
            },
            app: {
                borderTop: '1px solid #dddddd',
            },
            appName: {
                padding: 16,
                clear: 'both',
            },
            appLink: {
                textDecoration: 'none',
            },
            appActions: {
                display: 'inline-block',
                float: 'right',
                marginTop: -8,
                marginRight: -16,
            },
            appButtons: {
                marginLeft: '1rem',
            },
            appIcon: {
                borderRadius: 3,
            },
            upload: {
            },
            card: {
                marginTop: 8,
                marginRight: '1rem',
            },
            cardTitle: {
                background: '#5892BE',
            },
            cardTitleText: {
                fontSize: 28,
                fontWeight: 100,
            },
        };
        const baseUrl = d2.Api.getApi().baseUrl;

        const className = 'transition-mount transition-unmount' +
            (this.state.componentDidMount ? '' : ' transition-mount-active') +
            (this.props.transitionUnmount || !this.props.showUpload ? ' transition-unmount-active' : '');

        return (
            <div>
                {this.props.installedApps.length === 0 ? (
                    <div style={{marginTop: 64}}>
                        <div style={styles.noApps}>{d2.i18n.getTranslation('no_apps_installed')}</div>
                    </div>
                ) : (
                    <Card style={styles.card}>
                        <CardHeader title={d2.i18n.getTranslation('installed_applications')}
                                    style={styles.cardTitle}
                                    titleStyle={styles.cardTitleText}
                                    titleColor="white" />
                        <CardText>
                            <List style={styles.container}>{
                                this.props.installedApps.map(app => {
                                    return (
                                        <ListItem
                                            key={app.folderName}
                                            primaryText={app.name} secondaryText={'v' + app.version}
                                            style={styles.app}
                                            onTouchTap={this.open.bind(this, app.launchUrl)}
                                            leftAvatar={<Avatar style={styles.appIcon} src={[baseUrl, 'apps', app.folderName, app.icons['48']].join('/')} />}
                                            rightIconButton={
                                                <IconMenu iconButtonElement={<IconButton><MoreVertIcon color="#808080"/></IconButton>}>
                                                    <MenuItem onClick={this.uninstall.bind(this, app.folderName)}>Uninstall</MenuItem>
                                                </IconMenu>
                                            }/>
                                    );
                                })
                            }</List>
                        </CardText>
                    </Card>
                )}
                <div style={styles.upload}>
                    <div style={styles.fab}>
                        <div style={styles.fabAnim} className={'fab ' + className}>
                            <FloatingActionButton
                                onClick={this.newAction}
                                onClick={(e) => { this.refs.fileInput.click(e); }}>
                                <FontIcon className="material-icons">file_upload</FontIcon>
                            </FloatingActionButton>
                        </div>
                    </div>
                    <form ref={(ref) => { this.form = ref; }} style={{visibility: 'hidden'}}>
                        <input type="file" ref="fileInput" onChange={this.upload}/>
                    </form>
                </div>
            </div>
        );
    },

    open(url) {
        window.open(url);
    },

    uninstall(appKey) {
        actions.uninstallApp(appKey);
    },

    reloadApps() {
        actions.refreshApps();
    },

    upload(e) {
        actions.installApp(e.target.files[0], this.props.uploadProgress);
    },
});
