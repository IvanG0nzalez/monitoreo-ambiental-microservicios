import PushNotification from 'react-native-push-notification';

class NotificationService {
    constructor() {
        this.configure();
    }

    configure = () => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }

    localNotification = (title, message, soundName = null) => {
        PushNotification.localNotification({
            title: title,
            message: message,
            playSound: soundName !== null,
            soundName: soundName,
        });
    }
}

export default new NotificationService();