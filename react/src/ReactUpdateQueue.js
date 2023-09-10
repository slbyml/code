/**
 * 初始化更新队列
 * @param {*} fiber
 */
export function initializeUpdateQueue(fiber) {
  var queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  var update = {
    next: null
  };
  return update;
}

/**
 * 向当前fiber更新队列中添加一个更新
 * @param {*} fiber
 * @param {*} update
 */
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;

  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  sharedQueue.pending = update
}
