import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import { Dialog, Paragraph, Portal } from 'react-native-paper';
const maxSize = 1;

export const ImageSelectionModal = (props) => {
    const { closeModal, openCamera, openGallery, visible } = props;
    return (
        <Portal>
            <Dialog style={ { backgroundColor: "#fff" } } onDismiss={ closeModal } visible={ visible } dismissable={ true }>
                <Dialog.Title>Select an image</Dialog.Title>
                <Dialog.Content style={ { paddingBottom: 5 } }>
                    <Paragraph>Image must be less than { maxSize }MB</Paragraph>
                    <TouchableOpacity
                        onPress={ openCamera }
                        style={ styles.selectionType } >
                        <Icon name='camera' type="entypo" />
                        <Text>{ '  ' }{ 'Camera' }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ openGallery }
                        style={ styles.selectionType } >
                        <Icon name='photo-album' />
                        <Text>{ '  ' }{ 'Gallery' }</Text>
                    </TouchableOpacity>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}
const styles = StyleSheet.create({
    selectionType: { marginVertical: 10, flexDirection: 'row', alignItems: 'center' }
});
