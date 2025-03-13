package com.asyncbench.webflux;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Repository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.http.MediaType;
import lombok.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
class Post {
    private int postNumber;
    private LocalDate dateTime;
    private String userName;
    private String text;
    private Double rawSentiment;
    private Boolean positiveSentiment;
}	

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
class Response {
    private String name;
    private List<Post> posts;
}

@SpringBootApplication
public class JavaWebFluxBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(JavaWebFluxBackendApplication.class, args);
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)  // ✅ Disables CSRF for APIs
                .cors(cors -> cors.disable())  // ✅ CORS is handled separately by CorsWebFilter
                .authorizeExchange(auth -> auth.anyExchange().permitAll())  // ✅ Public API (No auth required)
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173"); // ✅ Allow frontend requests
        config.addAllowedMethod("*"); // ✅ Allow all HTTP methods
        config.addAllowedHeader("*"); // ✅ Allow all headers
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}

@Repository
class PostRepository {
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    
    private final String NAME = "Java/Spring WebFlux";

    public PostRepository(R2dbcEntityTemplate r2dbcEntityTemplate) {
        this.r2dbcEntityTemplate = r2dbcEntityTemplate;
    }

	public Mono<Response> getAllPosts() {
	    return r2dbcEntityTemplate
	            .select(Post.class)
	            .from("posts")
	            .all()
	            .collectList() // ✅ Collect all posts into a single list
	            .map(posts -> new Response(NAME, posts)); // ✅ Wrap inside Response
	}


}

@RestController
@RequestMapping("/all-posts")
class PostController {
    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_NDJSON_VALUE) // ✅ Supports streaming
	public Mono<Response> getAllPosts() {
	    return postRepository.getAllPosts();
	}

}
