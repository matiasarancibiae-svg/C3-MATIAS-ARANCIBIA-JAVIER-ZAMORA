<template>
    <div class="space-y-8">
        <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div class="space-y-5">


                <h1 class="max-w-2xl text-4xl font-extrabold tracking-tight text-brand-blue sm:text-5xl">
                    Demo para autenticación y acceso interno.
                </h1>

                <p class="max-w-2xl text-base leading-7 text-brand-gray/80 sm:text-lg">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, dolores. Assumenda, quisquam
                    asperiores. Pariatur laudantium, minima dolores reprehenderit impedit at quam totam libero. Natus,
                    mollitia esse obcaecati repudiandae sequi suscipit.
                </p>


            </div>

            <UCard class="border border-brand-border bg-white/95 shadow-xl shadow-brand-blue/5">
                <template #header>
                    <p class="text-xl font-bold text-brand-blue">
                        Estructura incluida
                    </p>
                </template>

                <div class="space-y-4 text-sm leading-6 text-brand-gray/80">
                    <ul class="list-disc pl-5">
                        <li>Login de demostración con formulario.</li>
                        <li>Layout con navegacion entre pàginas.</li>
                        <li>Pagina de inicio.</li>
                        <li>Listado de usuarios del sistema.</li>
                    </ul>
                </div>
            </UCard>
        </section>
    </div>
</template>