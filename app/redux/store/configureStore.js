import { createStore } from 'redux'
import rootReducer from '../reducer'


// [preloadedState] (any): 初始时的 state。
// 如果你使用 combineReducers 创建 reducer，它必须是一个普通对象，与传入的 keys 保持同样的结构。
// 否则，你可以自由传入任何 reducer 可理解的内容。
export default function configureStore(preloadedState) {
    return createStore(rootReducer, preloadedState,
        // 触发 redux-devtools
        window.devToolsExtension ? window.devToolsExtension() : undefined
    );
}