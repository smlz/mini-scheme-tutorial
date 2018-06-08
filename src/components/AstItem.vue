<template>
    <li v-if="isList">
        <ul>
            <AstItem v-for="item of model" :key="item.toString()" :model="item"></AstItem>
        </ul>
    </li>
    <li v-else :class="model.valueOf()">{{model.valueOf()}}</li>
</template>

<script>
export default {
    name: "AstItem",
    props: ["model"],
    computed: {
        isList: function() {
            return this.model instanceof Array;
        },
    },
    data () {
        return {
        };
    },
    methods: {

    },
};
</script>

<style scoped>
</style>
