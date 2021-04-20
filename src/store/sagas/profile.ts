import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as AuthActions } from '../slices/auth'
import * as ArbitratorApi from '../../api/arbitrator'
import { actions as ArbitratorActions } from '../slices/arbitrator'
import { willSaveArbitratorSettings } from './arbitrator'
import { willGetAlgorandAccountInfo } from './transaction'
import { actions as NotificationActions } from '../slices/notification'
import * as ServiceApi from '../../api/service'
import { actions as UIActions } from '../slices/ui'
import { push } from 'connected-react-router'

import { willGetArbitrator } from './arbitrator'
import { willCheckAccountTransaction } from './transaction'

const algosdk = require('algosdk');

export function* sagas() {
  yield takeLatest(ProfileActions.willGoToProfile.type, willGoToProfile)
  yield takeLatest(ProfileActions.willRetrieveProfileData.type, willRetrieveProfileData)
  yield takeLatest(ProfileActions.willAddPublicKey.type, willAddPublicKey)
  yield takeLatest(AuthActions.didLoginUserSuccess.type, willRetrieveProfileData)
  yield takeEvery(ProfileActions.willGetUserProfile.type, willGetUserProfile)
  yield takeEvery(ProfileActions.willUploadPortrait.type, willUploadPortrait)
  yield takeEvery(ProfileActions.willSubmitProfile.type, willSubmitProfile)
  yield takeEvery(ProfileActions.willSaveMnemonic.type, willSaveMnemonic)
  console.log('in profile saga');
}

function* willGoToProfile(action: any) {
  console.log("in willGoToProfile with: ", action)
  yield put(ProfileActions.startLoadingProfile())

  try {
    yield call(willGetArbitrator, action)

    action.payload.history.push('/profile')
    yield put(ProfileActions.stopLoadingProfile())
  } catch (error) {
    console.log('error in willGoToProfile ', error)
  }
}

function* willRetrieveProfileData(action: any) {
  console.log('in willRetrieveProfileData with ', action);

  try {
    const result = yield call(ServiceApi.getProfileData, null);
    yield put(ProfileActions.didRetrieveProfileData(result))
    if (result.public_key == null) {
      yield call(willGenerateAlgoAccount)
      yield put(push("/create-algo-account"))
    }
    else {
      const algorandData = yield call(willGetAlgorandAccountInfo, { payload: result.public_key })
      yield put(ProfileActions.didRetrieveAlgorandData(algorandData))
    }

  } catch (error) {
    console.log('Error retriving profile data', error);
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
}

function* willAddPublicKey(action: any) {
  console.log("in willAddPublicKey with ", action)
  yield put(UIActions.startActivityRunning("savePublicAddress"));
  const publicKey = action.payload.publicKey

  try {
    const result = yield call(ServiceApi.putProfileData, "public_key", publicKey)
    console.log("willAddPublicKey ", result)
    yield put(NotificationActions.willShowNotification({ message: "Public address saved", type: "success" }))
    action.payload.history.push('/')
  } catch (error) {
    console.log("willAddPublicKey error: ", error)
  }
  yield put(UIActions.stopActivityRunning("savePublicAddress"));
}

function* willGenerateAlgoAccount() {
  console.log("in willGenerateAlgoAccount")
  try {
    const account = algosdk.generateAccount();
    console.log("result account: ", account)
    yield put(ProfileActions.didGenerateAlgoAccount(account));
  } catch (error) {
    console.log("willGenerateAlgoAccount error", error)
  }
}

export function* willGetUserProfile(action: any) {
  // console.log("in willGetUserProfile with ", action)
  const users = yield select(ProfileSelectors.getUsers)

  try {
    if (!users[action.user]) {
      const result = yield call(ServiceApi.getProfileData, action.user);
      console.log("in willGetUserProfile result ", result)

      yield put(ProfileActions.didGetUserProfile({ userID: action.user, userData: result }))
      return result
    }
    else {
      return users[action.user]
    }
  } catch (error) {
    console.log("error willGetUserProfile: ", error)
  }
}

export function* willUploadPortrait(action: any) {
  console.log("in willUploadPortrait with: ", action)

  try {
    const resultUrl = yield call(ServiceApi.getResourceUrl, "portrait", 600, action.payload.portrait.type)
    console.log("result willUploadPortrait: ", resultUrl)

    yield call(ServiceApi.uploadFileToS3, resultUrl, action.payload.portrait)
    yield put(NotificationActions.willShowNotification({ message: "Profile updated", type: "success" }));

    yield put(ProfileActions.didUploadPortrait());
  } catch (error) {
    console.log("willUploadPortrait error", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
}

export function* willSubmitProfile(action: any) {
  console.log("in willSubmitProfile with: ", action)
  yield put(UIActions.startActivityRunning("submitProfile"));
  yield put(ProfileActions.startLoadingProfile())

  try {
    yield call(willSaveProfile, action)
    yield call(willSaveArbitratorSettings, action)

    yield put(NotificationActions.willShowNotification({ message: "Profile updated", type: "success" }));
  } catch (error) {
    console.log("willSubmitProfile error", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("submitProfile"));
  yield put(ProfileActions.stopLoadingProfile())
}

function* willSaveProfile(action: any) {
  console.log("in willSaveProfile with: ", action)

  try {
    const resultBio = yield call(ServiceApi.putProfileData, "bio", action.payload.bio)
    console.log("willSaveProfile result", resultBio)
    yield put(ProfileActions.didSaveProfile(resultBio));

    const fullAddress = {
      address: action.payload.address,
      city: action.payload.addressCity,
      zip: action.payload.addressZip,
      state: action.payload.addressState,
      country: action.payload.addressCountry
    }

    // const fullAddressString = action.payload.address + ', ' + action.payload.addressCity + ', ' + action.payload.addressState + ', ' + action.payload.addressZip + ', ' + action.payload.addressCountry
    console.log("in willSaveProfile fullAddress: ", fullAddress)
    // console.log("in willSaveProfile fullAddressString: ", fullAddressString)

    const resultAddress = yield call(ServiceApi.putProfileData, "address", JSON.stringify(fullAddress))
    console.log("willSaveProfile result", resultAddress)
    yield put(ProfileActions.didSaveProfile(resultAddress));
  } catch (error) {
    console.log("willSaveProfile error", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
}

export function* willSaveMnemonic(action: any) {
  console.log("in willSaveMnemonic with: ", action)
  yield put(UIActions.startActivityRunning("willSaveMnemonic"));

  try {
    if (action.payload.save) {
      const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPayAlgo: 0, currency: 'ALGO' } })

      if (resultCheckAccountTransaction.check) {
        const saveMnemonic = {
          save: true,
          salt: 'uncommon',
          encryptedMnemonic: action.payload.mnemonicSecretKey
        }
        localStorage.setItem('saveMnemonic', JSON.stringify(saveMnemonic))

        yield put(ProfileActions.didSaveMnemonic({ success: "The encrypted mnemonic secret key was saved in the local storage of the current browser." }))
        yield put(NotificationActions.willShowNotification({ message: "Mnemonic secret key saved", type: "success" }));
      }
      else {
        yield put(ProfileActions.didSaveMnemonicFail({ error: resultCheckAccountTransaction.error }))
        yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
      }
    }
    else {
      const saveMnemonic = {
        save: false,
        salt: undefined,
        encryptedMnemonic: undefined
      }
      localStorage.setItem('saveMnemonic', JSON.stringify(saveMnemonic))
      yield put(ProfileActions.didSaveMnemonic({ success: "Your decision was saved." }))
    }
  } catch (error) {
    console.log("willSaveMnemonic error", error)
    yield put(ProfileActions.didSaveMnemonicFail({ error: error.message }))
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("willSaveMnemonic"));
}