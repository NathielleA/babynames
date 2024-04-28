<template>
    <section>
        <b-button size="is-mediun"
            label="Toggle"
            @click="isOpenChat = !isOpenChat" />
            <b-message 
            title="Olá, eu sou Hera" 
            type="is-dark" 
            v-if="isOpenChat"
            has-icon icon="account" 
            aria-close-label="Close message">
            <span>
                <icon class="icon is-large" > 
                    <img src="@\assets\hera8.jpeg"/></icon>
            </span>
            Lorem ipsum dolor sit amet, consectetur warning elit. Fusce id fermentum quam. Proin sagittis, nibh id hendrerit imperdiet, elit sapien laoreet elit
        </b-message>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                isOpenChat: false
            }
        }
    }
</script>