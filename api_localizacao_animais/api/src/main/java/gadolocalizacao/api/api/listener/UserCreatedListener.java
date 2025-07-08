package gadolocalizacao.api.api.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UserCreatedListener {

    // Escuta a fila definida no application.properties -> rabbitmq.queue=user-created
    @RabbitListener(queues = "${rabbitmq.queue}")
    public void receiveMessage(String message) {
        System.out.println("📥 Mensagem recebida da fila user-created:");
        System.out.println(message);
    }
}
