'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    Platform,
    ScrollView,
} from 'react-native';

type State = {
    keyboardUp: boolean,
}

class Tabs extends Component {
    state: State = {};

    onSelect(el){
        if (el.props.onSelect) {
            el.props.onSelect(el);
        } else if (this.props.onSelect) {
            this.props.onSelect(el);
        }
    }

    componentWillMount(){
        if (Platform.OS==='android') {
            Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
            Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
        }
    }

    keyboardWillShow = (e) => {
        this.setState({ keyboardUp: true });
    };

    keyboardWillHide = (e) => {
        this.setState({ keyboardUp: false });
    };

    render(){
        const self = this;
        let selected = this.props.selected
        if (!selected){
            React.Children.forEach(this.props.children.filter(c=>c), el=>{
                if (!selected || el.props.initial){
                    selected = el.props.name || el.key;
                }
            });
        }
        let scrollable = this.props.scrollable || false;
        let children = React.Children.map(this.props.children.filter(c => c), (el) =>
            <TouchableOpacity key={el.props.name+"touch"}
                       style={[styles.iconView,scrollable && {flex:0}, this.props.iconStyle, (el.props.name || el.key) == selected ? this.props.selectedIconStyle || el.props.selectedIconStyle || {} : {} ]}
                       onPress={()=>!self.props.locked && self.onSelect(el)}
                       onLongPress={()=>self.onSelect(el)}
                       activeOpacity={el.props.pressOpacity}>
                         {selected == (el.props.name || el.key) ? React.cloneElement(el, {selected: true, style: [el.props.style, this.props.selectedStyle, el.props.selectedStyle]}) : el}
                    </TouchableOpacity>
        );
        if (scrollable) {
            return (
                <View style={[styles.tabbarView, this.props.style]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {children}
                </ScrollView> 
            </View>
            )
        } else {
            return (
                <View style={[styles.tabbarView, this.props.style]}>
                {children}
            </View>
            )
        }
    }
}
var styles = StyleSheet.create({
    tabbarView: {
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        height:50,
        opacity:1,
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hidden: {
        height: 0,
    },
});

module.exports = Tabs;
