
<template>
    <div class="tokens">
        <h4>Tokens</h4>
        <p>
          <template v-for="(token, i) in tokens">
            <span class="token" :key="i">{{token.valueOf()}}</span>&nbsp;
          </template>
        </p>
      </div>
</template>

<script>
export default {
    name: "SourceCode",
    props: ["tokens"],
    data () {
        return {
        };
    },
    computed: {

    },
    methods: {

    },
};
</script>

<style>
span.token {
  border: 2px darkblue solid;
  background-color: lightblue;
  padding: 2px 5px;
  border-radius: 4px;
  line-height: 2.2;
}
</style>