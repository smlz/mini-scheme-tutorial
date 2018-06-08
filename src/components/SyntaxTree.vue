
<template>
    <div class="ast">
        <h4>Syntax-Tree</h4>
            <AstItem :model="ast"></AstItem>
    </div>
</template>

<script>
import AstItem from "./AstItem";


export default {
    name: "SyntaxTree",
    props: ["ast"],
    data () {
        return {
        };
    },
    computed: {

    },
    methods: {

    },
    components: {
        AstItem,
    }
};
</script>

<style>
div.ast li {
  font-weight: normal;
  padding-left: 10px;
  text-indent: -10px;
  list-style: none;
}

div.ast ul > li:first-child {
  font-weight: bold;
}
div.ast ul {
  display: inline-block;
  list-style: none;
  vertical-align: middle;
  margin: 3px 0px;
  padding: 1px 10px 1px 5px;
  border: 3px solid green;
  border-radius: 9px;
}
div.ast {
    margin-bottom: 10px;
}
</style>