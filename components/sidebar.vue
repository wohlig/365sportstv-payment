<template>
  <v-navigation-drawer
    v-model="sidebarMenu"
    app
    :permanent="sidebarMenu"
    style="background-color: black"
    width="200px"
  >
    <v-list>
      <div v-for="item in items" :key="item.title">
        <v-list-item
          v-if="!item.subLinks"
          :key="item.title"
          link
          :to="item.href"
        >
          <v-list-item-icon>
            <v-icon class="iconify" style="color: white">{{
              item.icon
            }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group v-else :key="item.title" no-action>
          <template v-slot:activator>
            <div class="d-flex">
              <v-list-item-icon>
                <v-icon class="iconify" style="color: white">{{
                  item.icon
                }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </div>
          </template>

          <v-list-item
            v-for="sublink in item.subLinks"
            :to="sublink.to"
            :key="sublink.text"
          >
            <v-list-item-title class="text" v-text="sublink.text" />
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      sidebarMenu: true,
      items: [
        {
          title: "Pending Requests",
          href: "/pendingRequests/",
          icon: "mdi-transfer",
        },
        {
          title: "Logout",
          href: "/",
          icon: "mdi-logout-variant",
        },
      ],
    };
  },
};
</script>

<style scoped>
.text {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: #fbfbff;
}
.mdi:before,
.mdi-set {
  color: white !important;
}

</style>
