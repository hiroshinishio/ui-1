import _ from 'lodash'

import AJAX from 'src/utils/ajax'

import {Telegraf, TelegrafRequest, TelegrafRequestPlugins} from 'src/api'
import {telegrafsApi} from 'src/utils/api'

export const getSetupStatus = async (url: string): Promise<boolean> => {
  try {
    const {data} = await AJAX({
      method: 'GET',
      url,
    })
    const {allowed} = data
    return allowed
  } catch (error) {
    console.error("Can't get setup status", error)
    throw error
  }
}

export const getTelegrafConfigTOML = async (
  telegrafID: string
): Promise<string> => {
  const options = {
    headers: {
      Accept: 'application/toml',
    },
  }

  const response = await telegrafsApi.telegrafsTelegrafIDGet(
    telegrafID,
    options
  )

  return response.data as string // response.data is string with 'application/toml' header
}

export const createTelegrafConfig = async (): Promise<Telegraf> => {
  const telegrafRequest: TelegrafRequest = {
    name: 'testName',
    agent: {interval: 1},
    plugins: [
      {
        name: TelegrafRequestPlugins.NameEnum.Cpu,
        type: TelegrafRequestPlugins.TypeEnum.Input,
        comment: 'this is a test',
        config: {},
      },
    ],
  }
  const {data} = await telegrafsApi.telegrafsPost('123', telegrafRequest)
  return data
}

export interface SetupParams {
  username: string
  password: string
  org: string
  bucket: string
}

export const setSetupParams = async (
  url: string,
  setupParams: SetupParams
): Promise<void> => {
  try {
    await AJAX({
      method: 'POST',
      url,
      data: setupParams,
    })
  } catch (error) {
    console.error("Can't set setup parameters", error)
    throw error
  }
}

export const signin = async (
  url: string,
  params: {username: string; password: string}
): Promise<void> => {
  const {username, password} = params
  try {
    await AJAX({
      method: 'POST',
      url,
      auth: {
        username,
        password,
      },
    })
  } catch (error) {
    console.error('Sign in has failed', error)
    throw error
  }
}

export const trySources = async (url: string): Promise<boolean> => {
  try {
    await AJAX({
      method: 'GET',
      url,
    })
    return true
  } catch (error) {
    console.error('Sign in has failed', error)
    return false
  }
}
