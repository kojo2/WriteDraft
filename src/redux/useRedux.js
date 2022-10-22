import { useSelector } from 'react-redux'

const useRedux = (reducer = 'main') => {
  const state = useSelector((s) => s[`${reducer}Reducer`])
  return state
}

export default useRedux
