import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { FaceRecognitionState } from './Types';

import {
  AppDispatch,
  RootState,
} from '../../config/Redux';
import { saveFacebank } from '../../machine-learning/FacebankManager';
import {
  preloadFacebank,
  reloadDynamicModel,
} from '../../machine-learning/FaceSimilarity';
import { loadFaceModels } from '../../machine-learning/LoadModels';
import { reduxNotifyError } from '../../utils/helpers';
import FaceRecognitionService from './Service';

const initialState: FaceRecognitionState = {
  status: 'idle',
};

export const FaceRecognitionSlice = createSlice({
  name: 'faceRecognition',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
  },
});

export const {changeStatus} = FaceRecognitionSlice.actions;

export const getFaceModels =
  (collectorId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(changeStatus('loading'));

      const {data} = await FaceRecognitionService.getTrainedModel(collectorId);
      // data: FaceEmbedding[] já no formato correto

      await saveFacebank(data); // salva faces_embeddings.json
      reloadDynamicModel(); // limpa cache em memória
      await preloadFacebank(true); // recarrega do arquivo salvo

      dispatch(changeStatus('success'));
    } catch (error) {
      dispatch(changeStatus('error'));
      dispatch(reduxNotifyError(error));
      throw error; // <-- opcional: propaga erro para quem chamar poder tratar
    } finally {
      // ⚠️ aqui é async também; garanta que aguardamos carregar os modelos
      await loadFaceModels(); // carrega modelos do Tensor/TFJS (ou o que for)
      dispatch(changeStatus('idle'));
    }
  };

const reducer = (state: RootState) => state.faceRecognition;
export const isLoadingSelector = (state: RootState) =>
  reducer(state).status == 'loading';
