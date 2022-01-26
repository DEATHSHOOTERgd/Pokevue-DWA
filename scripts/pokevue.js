window.addEventListener('load',()=>{
    const pokedex=Vue.createApp({
        data(){
            return {
                pokemons:[],
                range:8,
                currentPage:0,
                coloresDeTipo:coloresDeTipo
            }
        },
        methods:{
            listPokemons: async function(){
                const response= await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${this.range}&offset=${this.currentPage * this.range}`);
                const pokemonList= Object.values( await response.json())[3];
                await this.fetchPokemons(pokemonList);
                this.updateLocalStorage(this.pokemons);
            },
            fetchPokemons: async function(pokemonList){
                let pokemons=Array();
                for(let i=0; i<pokemonList.length;i++){
                    let response= await fetch(pokemonList[i].url);
                    pokemons.push(await response.json());
                }
                this.pokemons=pokemons;
            },
            updateLocalStorage: function(){
                localStorage.setItem('pokevue.pokemons',JSON.stringify(this.pokemons));
            },
            nextPage: function(){
                this.currentPage++;
                this.listPokemons();
            },
            lastPage: function(){
                if(this.currentPage>0){
                    this.currentPage--;
                    this.listPokemons();
                }
            }
        },
        created(){
            if(localStorage.getItem('pokevue.pokemons')!==null){
                this.pokemons=JSON.parse(localStorage.getItem('pokevue.pokemons'));
            }else{
                this.listPokemons();
            }
        }
    })
    pokedex.mount('#pokevue');
})