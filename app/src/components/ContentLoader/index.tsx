import * as React from 'react';

// @ts-ignore
import ContentLoader from 'react-native-content-loader'
import {Circle, Rect} from 'react-native-svg'

export default class Index extends React.Component<any> {

    render(){


        return (
            <>
                <ContentLoader
                    speed={2}
                    width={370}
                    height={500}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <Circle cx="27" cy="35" r="26" />
                    <Circle cx="86" cy="35" r="26" />
                    <Circle cx="146" cy="35" r="26" />
                    <Circle cx="206" cy="35" r="26" />
                    <Circle cx="266" cy="35" r="26" />

                    <Circle cx="27" cy="121" r="26" />
                    <Circle cx="87" cy="123" r="26" />
                    <Circle cx="145" cy="123" r="26" />
                    <Circle cx="206" cy="121" r="26" />

                    <Rect x="1" y="80" rx="0" ry="0" width="360" height="1" />
                    <Rect x="1" y="160" rx="0" ry="0" width="360" height="1" />

                    <Rect x="1" y="180" rx="0" ry="0" width="100" height="100" />
                    <Rect x="120" y="180" rx="0" ry="0" width="100" height="100" />
                    <Rect x="240" y="180" rx="0" ry="0" width="100" height="100" />

                    <Rect x="1" y="300" rx="0" ry="0" width="340" height="37" />
                </ContentLoader>
            </>
        );
    }
}


