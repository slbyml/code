import { registerMicroApps, start } from ".";

registerMicroApps([
  {
    name: "app-react",
    entry: "//localhost:9001",
    container: "#subapp-wrap",
    activeRule: "/app-react"
  },{
    name: "app-vue2",
    entry: "//localhost:9002",
    container: "#subapp-wrap",
    activeRule: "/app-vue2"
  },{
    name: "app-vue3",
    entry: "//localhost:9003",
    container: "#subapp-wrap",
    activeRule: "/app-vue3"
  }
])

start()
