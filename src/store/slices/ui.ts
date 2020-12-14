import { createSlice, PayloadAction, createDraftSafeSelector, createSelector } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'ui',
  initialState: {
    activitiesRunning: {} as any
  },
  reducers: {
    startActivityRunning: (state, action: PayloadAction<string>) => void (state.activitiesRunning[action.payload] = true),
    stopActivityRunning: (state, action: PayloadAction<string>) => void (delete state.activitiesRunning[action.payload])
  }
})

// Extract the action creators object and the reducer
export const { actions, reducer }: any = currentSlice
export const { startActivityRunning, stopActivityRunning } = actions

const activitiesRunningSelector = (state: any) => state.ui.activitiesRunning;
export const selectors = {
  activityRunningSelector: createDraftSafeSelector(
    (state: any) => state.ui.activitiesRunning,
    (_: any, currentActivity: string) => currentActivity,
    (activitiesRunning: any, currentActivity: any) => activitiesRunning[currentActivity] != undefined ? activitiesRunning[currentActivity] : false
  )
}
