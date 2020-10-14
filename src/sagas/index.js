/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects';

import emailSagas from './Email';
import todoSagas from './Todo';
import feedbacksSagas from './Feedbacks';

export default function* rootSaga(getState) {
    yield all([
        emailSagas(),
        todoSagas(),
        feedbacksSagas()
    ]);
}