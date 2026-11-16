package cl.duoc.pasteleria.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.duoc.pasteleria.security.JwtAuthFilter;
import cl.duoc.pasteleria.security.JwtService;
import cl.duoc.pasteleria.service.ProductoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductoController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductoControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean ProductoService service;
    @MockitoBean JwtService jwtService;
    @MockitoBean JwtAuthFilter jwtAuthFilter;

    @Test
    void rejectsBlankNameBeforeCallingService() throws Exception {
        mvc.perform(post("/api/v1/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"codigo\":\"TC001\",\"nombre\":\"   \",\"categoria\":\"Tortas\",\"precio\":1000,\"stock\":1}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Completa el nombre"));
        verifyNoInteractions(service);
    }
}
