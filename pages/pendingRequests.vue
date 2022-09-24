<template>
  <div>
    <sidebar />
    <v-container class="d-flex justify-center">
      <v-text-field
        class="mx-5 solid px-2 my-4"
        type="text"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search Name"
        v-model="searchusername"
        ><template v-slot:prepend-inner>
          <v-icon class="qty-icon">mdi-magnify</v-icon>
        </template>
      </v-text-field>
      <v-text-field
        class="mx-5 solid px-2 my-4"
        type="text"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search Mobile"
        v-model="searchmobile"
        ><template v-slot:prepend-inner>
          <v-icon class="qty-icon">mdi-magnify</v-icon>
        </template>
      </v-text-field>
      <v-text-field
        class="mx-5 solid px-2 my-4"
        type="text"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search Order"
        v-model="searchorder"
        ><template v-slot:prepend-inner>
          <v-icon class="qty-icon">mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-container>

    <div class="index">
      <div class="d-flex justify-space-between">
        <div class="d-flex justify-start">
          <div class="text1">Requests</div>
          <div class="sub-txt">&nbsp;({{ count + ' users' }})</div>
        </div>
      </div>

      <v-data-table
        :page="page"
        :pageCount="maxPage"
        :options.sync="options"
        :server-items-length="count"
        :headers="headers"
        :items="formattedData"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 15, 20, 50],
          showCurrentPage: true,
          showFirstLastPage: true,
        }"
        class="elevation-1 mr-5 mt-3 texttt"
      >
        <template v-slot:[`item.createdAt`]="row">{{
          row.item.createdAt | formatDateTime
        }}</template>
        <template v-slot:[`item.transactionWay`]="row">{{
          row.item.transactionWay | formatText
        }}</template>
        <template v-slot:[`item.amount`]="row"
          >₹ {{ row.item.amount | formatAmount }}</template
        >
        <template v-slot:[`item.screenshot`]="row">
          <v-dialog>
            <template v-slot:activator="{ on, attrs }">
              <button type="button" class="button" v-bind="attrs" v-on="on">
                <span class="btntext">Screenshot</span>
              </button>
            </template>
            <v-card class="d-flex justify-center flex-column">
              <div
                class="d-flex py-1 justify-space-around"
                style="
                  color: black;
                  background-color: yellow;
                  border: 3px solid red;
                "
              >
                <div><strong>Plan Amount: </strong>₹ {{ row.item.amount }}</div>
                <div><strong>UTR ID: </strong>{{ row.item.utrId }}</div>
                <div><strong>Plan Name: </strong>{{ row.item.plan.name }}</div>
              </div>
              <v-img :src="row.item.screenshot" height="84vh" contain />
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:[`item.status`]="row">
          <v-icon
            class="p-0 ml-1"
            large
            @click="changestatus(row.item._id, 'completed')"
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon
            class="p-0 ml-1"
            large
            @click="changestatus(row.item._id, 'cancelled')"
            >mdi-close-circle</v-icon
          >
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
let _ = require('lodash')
import gameService from '../service/gameService.js'
export default {
  name: 'Payment',
  middleware: 'authenticated',

  data() {
    return {
      count: 0,
      page: 1,
      searchusername: '',
      searchmobile: '',
      searchorder: '',
      maxPage: 1,
      options: {},
      paymentDetails: [],
      formattedData: [],
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'user.name',
          sortable: false,
        },
        {
          text: 'Mobile',
          value: 'user.mobile',
          sortable: false,
        },
        { text: 'Created At', value: 'createdAt', sortable: false },
        { text: 'Plan Name', value: 'plan.name', sortable: false },
        { text: 'Amount', value: 'amount', sortable: false },
        { text: 'UTR ID', value: 'utrId', sortable: false },
        { text: 'Type', value: 'manualTransferType', sortable: false },
        { text: 'Screenshot', value: 'screenshot', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
      ],
    }
  },
  methods: {
    async getPaymentDetails() {
      let { sortBy, sortDesc, page, itemsPerPage } = this.options
      try {
        const data = {
          page: page,
          itemsPerPage: itemsPerPage,
          sortBy: sortBy,
          sortDesc: sortDesc,
          searchuserFilter: this.searchusername,
          searchmobileFilter: this.searchmobile,
          searchorderFilter: this.searchorder,
        }
        const result = await gameService.getAllPendingRequestsForAdmin(data)
        if (result.status === 200) {
          this.paymentDetails = result.data.data
          this.count = result.data.count
          this.maxPage = result.data.maxPage
          this.formattedData = this.paymentDetails
        }
      } catch (error) {
        console.log(error)
      }
    },
    async changestatus(id, status) {
      if (status == 'completed') {
        try {
          const data = {
            status: status,
          }
          const result = await gameService.updateManualTransferStatus(id, data)
          if (result.status == 200) {
            this.$notifier.showMessage({
              content: 'Status Updated Sucessfully',
              color: '#4CAF50',
            })
          }
        } catch (error) {
          console.log(error)
        }
        this.getPaymentDetails()
      }
      if (status == 'cancelled') {
        this.$dialog
          .prompt({
            text: 'Enter Message/Reason',
            title: 'Cancel Transaction',
          })
          .then(async (res) => {
            if (res) {
              try {
                const data = {
                  cancelMessage: res || '',
                  status: status,
                }
                const result = await gameService.updateManualTransferStatus(
                  id,
                  data
                )
                if (result.status == 200) {
                  this.$notifier.showMessage({
                    content: 'Status Updated Sucessfully',
                    color: '#4CAF50',
                  })
                }
              } catch (error) {
                console.log(error)
                this.$notifier.showMessage({
                  content: 'Something Went Wrong',
                  color: '#D50000',
                })
              }
              this.getPaymentDetails()
            }
          })
      }
    },
  },
  created() {
    if (!_.isEmpty(this.$route.query.options)) {
      this.options = JSON.parse(this.$route.query.options)
    }
  },
  watch: {
    options: {
      async handler() {
        let { sortBy, sortDesc, page, itemsPerPage } = this.options
        this.$router.push({
          query: {
            options: JSON.stringify({
              sortBy,
              sortDesc,
              page,
              itemsPerPage,
            }),
          },
          searchuserFilter: this.searchusername,
          searchmobileFilter: this.searchmobile,
          searchorderFilter: this.searchorder,
        })
        this.getPaymentDetails()
      },
      deep: true,
    },
    searchusername: {
      async handler() {
        let { sortBy, sortDesc, page, itemsPerPage } = this.options
        if (page === 1) {
          this.$router.push({
            query: {
              options: JSON.stringify({
                sortBy,
                sortDesc,
                page,
                itemsPerPage,
              }),
            },
          })
          this.getPaymentDetails()
        } else {
          this.options.page = 1
        }
      },
    },
    searchmobile: {
      async handler() {
        let { sortBy, sortDesc, page, itemsPerPage } = this.options
        if (page === 1) {
          this.$router.push({
            query: {
              options: JSON.stringify({
                sortBy,
                sortDesc,
                page,
                itemsPerPage,
              }),
            },
          })
          this.getPaymentDetails()
        } else {
          this.options.page = 1
        }
      },
    },
    searchorder: {
      async handler() {
        let { sortBy, sortDesc, page, itemsPerPage } = this.options
        if (page === 1) {
          this.$router.push({
            query: {
              options: JSON.stringify({
                sortBy,
                sortDesc,
                page,
                itemsPerPage,
              }),
            },
          })
          this.getPaymentDetails()
        } else {
          this.options.page = 1
        }
      },
    },
  },
}
</script>
<style scoped>
.texttt {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
}

.button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 101px;
  height: 30px;
  background: #000000;
  border-radius: 20px;
}
.btntext {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 10px;
}
.text1 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: #000000;
}
div.solid {
  border-style: solid;
  background-color: #413f3f;
}
.tick {
  border-radius: 50%;
  border: 1px solid #00860d;
  width: 29.87px;
  height: 29.87px;
  margin-right: 5px;
}
.wrong {
  border-radius: 50%;
  width: 29.87px;
  height: 29.87px;
  border: 1px solid #ff1230;
}

.ton1 {
  width: 73px;
  height: 30px;
  background: #00860d;
  border-radius: 20px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #ffffff;
  text-transform: capitalize;
}
.ton3 {
  width: 73px;
  height: 30px;
  background: #ff1230;
  border-radius: 20px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #ffffff;
  text-transform: capitalize;
}
</style>
