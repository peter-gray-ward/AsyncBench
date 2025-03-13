package com.asyncbench.mvc;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.*;



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
public class JavaMvcBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(JavaMvcBackendApplication.class, args);
	}
	@Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type")
                        .allowCredentials(true);
            }
        };
    }
}

@Repository
class PostRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<Post> getAllPosts() {
		String sql = "SELECT * FROM posts";
		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Post.class));
	}
}

@RestController
@RequestMapping("/all-posts")
class PostController {
	@Autowired
	private PostRepository postRepository;

	private final String NAME = "Java/Spring MVC";

	@GetMapping
	public ResponseEntity<Response> getAllPosts() {
		List<Post> posts = postRepository.getAllPosts();
		Response r = new Response(NAME, posts);
		return ResponseEntity.ok(r);
	}
}
