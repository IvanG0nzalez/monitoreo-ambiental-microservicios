import { StyleSheet } from 'react-native';

const commonStyles = {
  borderColor: '#ddd',
  borderWidth: 1,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
  backgroundColor: '#fff',
  padding: 10,
};

export const styleSensorScreen = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    fontSize: 24,
    marginBottom: 20
  },
  sensorScroll: {
    maxHeight: 100,
  },
  sensorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: 10,
  },
  contentScroll: {
    flex: 1,
    padding: 9,
  },
  contentContainer: {
    flexGrow: 1,
  },
  criticalityContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    elevation: 5,
  },
  criticalityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  criticalityStatus: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoBox: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
  },
  infoBoxTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  exclamationButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
  },
  chatButton: {
    alignSelf: 'flex-end',
    ...commonStyles,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chatButtonText: {
    color: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FE0000',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  levelInfo: {
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelConditions: {
    fontStyle: 'italic',
  },
  levelDescription: {
    marginTop: 5,
  },
  levelRecommendation: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});